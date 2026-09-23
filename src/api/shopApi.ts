import request from "./request";
import type {
  Pagination,
  ListResult,
  CategoriesItem,
  ProductItem,
  ProductListParams,
  OrderItem,
  OrderCreateParams,
  OrderListParams,
  AddCartsParams
} from "./types";

export const shopApi = {
  // 分类
  categories: (params: Pagination) => {
    return request.get<ListResult<CategoriesItem>>("/categories", { params });
  },

  // 商品列表
  goodsList: (params: ProductListParams) => {
    return request.get<ListResult<ProductItem>>("/products", { params });
  },

  // 单个商品
  goods: (id: number) => {
    return request.get<ProductItem>(`/products/${id}`);
  },

  // 提交订单
  orderCreate: (params: OrderCreateParams) => {
    return request.post("/orders", params);
  },

  // 订单列表
  orderList: (params: OrderListParams) => {
    return request.get<ListResult<OrderItem>>("/orders", {params});
  },

  // 订单详情
  orderDetail: (id: number) => {
    return request.get<OrderItem>(`/orders/${id}`);
  },

  // 订单支付
  orderPayment: (id: number, type: string) => {
    return request.post(`/orders/${id}/pay`, { paymentType: type });
  },

  // 取消订单
  cancelOrder: (id: number) => {
    return request.post(`/orders/${id}/cancel`)
  },

  // 删除订单
  deleteOrder: (id: number) => {
    return request.delete(`/orders/${id}`)
  },

  // 收货
  confirmOrder: (id: number) => {
    return request.post(`/orders/${id}/confirm`)
  },

  // 订单数徽标
  orderBadges: () => {
    return request.get("/orders/badges");
  },

  // 获取用户购物车
  carts: () => {
    return request.get("/carts")
  },

  // 加入购物车
  addCarts: (params: AddCartsParams) => {
    return request.post("/carts/items", params)
  },

  // 修改购物车数量
  updateCartsQuantity: (itemId: number, quantity: number) => {
    return request.patch(`/carts/items/${itemId}`, {quantity})
  },

  // 删除购物车
  removeCarts: (itemIds: number[]) => {
    return request.delete("/carts/items", {data: {itemIds}})
  }
};
