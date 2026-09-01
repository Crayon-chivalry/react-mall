import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ProductItem, SkuItem, OrderItem } from "@/api/types";

export interface CartItem {
  product: ProductItem;
  sku: SkuItem;
  quantity: number;
  checked: boolean;
}

interface ProductInterface {
  cartList: CartItem[];
  checkoutItems: CartItem[];
  // 当前待支付订单，用于支付弹框显示和支付操作，避免刷新页面丢失
  paymentOrder: OrderItem | null;
  /** 设置当前待支付订单，支付弹框会根据它恢复显示 */
  setPaymentOrder: (order: OrderItem | null) => void;
  /** 清空当前待支付订单，支付成功/取消后调用 */
  clearPaymentOrder: () => void;
  /** 添加购物车项；相同商品和 SKU 会累加数量 */
  addCartItem: (product: ProductItem, sku: SkuItem, quantity?: number) => void;
  /** 设置待确认订单的商品 */
  setCheckoutItems: (items: CartItem[]) => void;
  /** 删除指定商品和 SKU 的购物车项 */
  removeCartItem: (productId: number, skuId: number) => void;
  /** 批量删除已成功结算的购物车项 */
  removeCartItems: (items: Array<{ productId: number; skuId: number }>) => void;
  /** 设置指定购物车项的选中状态 */
  setCartItemChecked: (productId: number, skuId: number, checked: boolean) => void;
  /** 切换指定购物车项的选中状态 */
  toggleCartItemChecked: (productId: number, skuId: number) => void;
  /** 设置全部购物车项的选中状态 */
  setAllCartItemsChecked: (checked: boolean) => void;
  /** 更新指定购物车项的数量，数量会限制在库存范围内 */
  updateCartItemQuantity: (productId: number, skuId: number, quantity: number) => void;

}

const useProductStore = create<ProductInterface>()(persist((set) => ({
  cartList: [],
  checkoutItems: [],
  paymentOrder: null,
  setPaymentOrder: (order) => set({ paymentOrder: order }),
  clearPaymentOrder: () => set({ paymentOrder: null }),
  addCartItem: (product, sku, quantity = 1) => {
    set((state) => {
      const existingItem = state.cartList.find(
        (item) => item.product.id === product.id && item.sku.id === sku.id,
      );

      if (existingItem) {
        return {
          cartList: state.cartList.map((item) =>
            item === existingItem
              ? { ...item, quantity: Math.min(item.quantity + quantity, sku.stock) }
              : item,
          ),
        };
      }

      return {
        cartList: [
          ...state.cartList,
          { product, sku, quantity: Math.min(Math.max(quantity, 1), sku.stock), checked: true },
        ],
      };
    });
  },
  setCheckoutItems: (items) => {
    set({ checkoutItems: items });
  },
  removeCartItem: (productId, skuId) => {
    set((state) => ({
      cartList: state.cartList.filter(
        (item) => item.product.id !== productId || item.sku.id !== skuId,
      ),
    }));
  },
  removeCartItems: (items) => {
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
  updateCartItemQuantity: (productId, skuId, quantity) => {
    set((state) => ({
      cartList: state.cartList
        .map((item) =>
          item.product.id === productId && item.sku.id === skuId
            ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.sku.stock) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  }
}), {
  name: "mall-cart",
  // 只持久化购物车和待支付订单数据，避免将 store 方法写入存储层
  partialize: (state) => ({
    cartList: state.cartList,
    checkoutItems: state.checkoutItems,
    paymentOrder: state.paymentOrder,
  }),
}));

export default useProductStore;