import { create } from "zustand";
import { persist } from "zustand/middleware";

import { shopApi } from "@/api/shopApi";
import type { ProductItem, SkuItem } from "@/api/types";

export interface CartItem {
  id?: number;
  product: ProductItem;
  sku: SkuItem;
  quantity: number;
  checked: boolean;
}

interface CartStore {
  cartList: CartItem[];
  checkoutItems: CartItem[];
  /** 拉取后端购物车列表 */
  fetchCartList: () => Promise<void>;
  /** 添加购物车项；新增后重新拉取后端最新列表 */
  addCartItem: (product: ProductItem, sku: SkuItem, quantity?: number) => Promise<void>;
  /** 设置待确认订单的商品 */
  setCheckoutItems: (items: CartItem[]) => void;
  /** 删除指定商品和 SKU 的购物车项 */
  removeCartItem: (productId: number, skuId: number) => Promise<void>;
  /** 批量删除已成功结算的购物车项 */
  removeCartItems: (items: Array<{ productId: number; skuId: number }>) => Promise<void>;
  /** 设置指定购物车项的选中状态 */
  setCartItemChecked: (productId: number, skuId: number, checked: boolean) => void;
  /** 切换指定购物车项的选中状态 */
  toggleCartItemChecked: (productId: number, skuId: number) => void;
  /** 设置全部购物车项的选中状态 */
  setAllCartItemsChecked: (checked: boolean) => void;
  /** 更新指定购物车项的数量，数量会限制在库存范围内 */
  updateCartItemQuantity: (productId: number, skuId: number, quantity: number) => Promise<void>;
}

const normalizeCartItem = (item: any): CartItem => ({
  id: item.id,
  product: item.product,
  sku: item.sku,
  quantity: item.quantity,
  checked: true,
});

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartList: [],
      checkoutItems: [],
      fetchCartList: async () => {
        const { data: res } = await shopApi.carts();

        const payload = res.data ?? {};
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.items)
            ? payload.items
            : Array.isArray(payload.list)
              ? payload.list
              : [];

        set({
          cartList: list.map(normalizeCartItem),
        });
      },
      addCartItem: async (product, sku, quantity = 1) => {
        await shopApi.addCarts({
          productId: product.id,
          skuId: sku.id,
          quantity,
        });

        await get().fetchCartList();
      },
      setCheckoutItems: (items) => {
        set({ checkoutItems: items });
      },
      removeCartItem: async (productId, skuId) => {
        const targetItem = get().cartList.find(
          (item) => item.product.id === productId && item.sku.id === skuId,
        );

        if (targetItem?.id) {
          await shopApi.removeCarts([targetItem.id]);
        }

        set((state) => ({
          cartList: state.cartList.filter(
            (item) => item.product.id !== productId || item.sku.id !== skuId,
          ),
        }));
      },
      removeCartItems: async (items) => {
        const itemIds = get()
          .cartList.filter((cartItem) =>
            items.some(
              ({ productId, skuId }) =>
                cartItem.product.id === productId && cartItem.sku.id === skuId,
            ),
          )
          .map((item) => item.id)
          .filter((id): id is number => typeof id === "number");

        if (itemIds.length > 0) {
          await shopApi.removeCarts(itemIds);
        }

        set((state) => ({
          cartList: state.cartList.filter(
            (cartItem) =>
              !items.some(
                ({ productId, skuId }) =>
                  cartItem.product.id === productId && cartItem.sku.id === skuId,
              ),
          ),
        }));
      },
      setCartItemChecked: (productId, skuId, checked) => {
        set((state) => ({
          cartList: state.cartList.map((item) =>
            item.product.id === productId && item.sku.id === skuId
              ? { ...item, checked }
              : item,
          ),
        }));
      },
      toggleCartItemChecked: (productId, skuId) => {
        set((state) => ({
          cartList: state.cartList.map((item) =>
            item.product.id === productId && item.sku.id === skuId
              ? { ...item, checked: !item.checked }
              : item,
          ),
        }));
      },
      setAllCartItemsChecked: (checked) => {
        set((state) => ({
          cartList: state.cartList.map((item) => ({ ...item, checked })),
        }));
      },
      updateCartItemQuantity: async (productId, skuId, quantity) => {
        const targetItem = get().cartList.find(
          (item) => item.product.id === productId && item.sku.id === skuId,
        );

        if (targetItem?.id) {
          await shopApi.updateCartsQuantity(targetItem.id, quantity);
        }

        set((state) => ({
          cartList: state.cartList
            .map((item) =>
              item.product.id === productId && item.sku.id === skuId
                ? {
                    ...item,
                    quantity: Math.min(Math.max(quantity, 1), item.sku.stock),
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },
    }),
    {
      name: "mall-cart",
      partialize: (state) => ({
        cartList: state.cartList,
        checkoutItems: state.checkoutItems,
      }),
    },
  ),
);

export default useCartStore;