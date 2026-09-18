import request from "./request";
import type {
  ApiResponse,
  Pagination,
  ProductListParams,
  OrderCreateParams,
  OrderListParams,
  AddCartsParams
} from "./types";

export const shopApi = {
  // 分类
  categories: (params: Pagination) => {
    return request.get<ApiResponse>("/categories", { params });
  },

  // 商品列表
  goodsList: (params: ProductListParams) => {
    return request.get<ApiResponse>("/products", { params });
  },

  // 单个商品
  goods: (id: number) => {
    return request.get<ApiResponse>(`/products/${id}`);
  },

  // 提交订单
  orderCreate: (params: OrderCreateParams) => {
    return request.post<ApiResponse>("/orders", params);
  },

  // 订单列表
  orderList: (params: OrderListParams) => {
    return request.get<ApiResponse>("/orders", {params});
  },

  // 订单详情
  orderDetail: (id: number) => {
    return request.get<ApiResponse>(`/orders/${id}`);
  },

  // 订单支付
  orderPayment: (id: number, type: string) => {
    return request.post<ApiResponse>(`/orders/${id}/pay`, { paymentType: type });
  },

  // 取消订单
  cancelOrder: (id: number) => {
    return request.post<ApiResponse>(`/orders/${id}/cancel`)
  },

  // 删除订单
  deleteOrder: (id: number) => {
    return request.delete<ApiResponse>(`/orders/${id}`)
  },

  // 收货
  confirmOrder: (id: number) => {
    return request.post<ApiResponse>(`/orders/${id}/confirm`)
  },

  // 订单数徽标
  orderBadges: () => {
    return request.get<ApiResponse>("/orders/badges");
  },

  // 获取用户购物车
  carts: () => {
    return request.get<ApiResponse>("/carts")
  },

  // 加入购物车
  addCarts: (params: AddCartsParams) => {
    return request.post<ApiResponse>("/carts/items", params)
  },

  // 修改购物车数量
  updateCartsQuantity: (itemId: number, quantity: number) => {
    return request.patch<ApiResponse>(`/carts/items/${itemId}`, {quantity})
  },

  // 删除购物车
  removeCarts: (itemIds: number[]) => {
    return request.delete<ApiResponse>("/carts/items", {data: {itemIds}})
  }
};
