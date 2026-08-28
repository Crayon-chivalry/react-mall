import request from "./request";
import type {
  ApiResponse,
  Pagination,
  ProductListParams,
  OrderCreateParams,
  OrderListParams,
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

  orderList: (params: OrderListParams) => {
    return request.get<ApiResponse>("/orders", {params});
  },
};
