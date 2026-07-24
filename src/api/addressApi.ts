import request from "./request";
import type { ApiResponse, AddressItem } from './types'

export const addressApi = {
  // 用户地址列表
  list: () => {
    return request.get<ApiResponse>("/shipping-addresses")
  },

  // 添加地址
  add: (params: AddressItem) => {
    return request.post<ApiResponse>("/shipping-addresses", params)
  },

  // 修改地址
  update: (params: AddressItem) => {
    return request.patch<ApiResponse>("/shipping-addresses", params)
  },

  // 删除地址
  delete: (id: number) => {
    return request.patch<ApiResponse>(`/shipping-addresses/${id}`)
  },
}