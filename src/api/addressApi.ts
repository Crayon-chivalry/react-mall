import request from "./request";
import type { ApiResponse, AddressItem } from './types'

export const addressApi = {
  // 用户地址列表
  list: () => {
    return request.get<ApiResponse>("/shipping-addresses")
  },

  // 地址详情
  details: (id: number) => {
    return request.get<ApiResponse>(`/shipping-addresses/${id}`)
  },

  // 添加地址
  add: (params: AddressItem) => {
    return request.post<ApiResponse>("/shipping-addresses", params)
  },

  // 修改地址
  update: (id: number, params: AddressItem) => {
    return request.patch<ApiResponse>(`/shipping-addresses/${id}`, params)
  },

  // 删除地址
  delete: (id: number) => {
    return request.delete<ApiResponse>(`/shipping-addresses/${id}`)
  },

  // 设置默认
  setDefault: (id: number) => {
    return request.patch<ApiResponse>(`/shipping-addresses/${id}/default`)
  },

  // 获取默认地址
  default: () => {
    return request.get<ApiResponse>("/shipping-addresses/default")
  }
}