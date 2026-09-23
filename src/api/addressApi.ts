import request from "./request";
import type { AddressItem } from './types'

export const addressApi = {
  // 用户地址列表
  list: () => {
    return request.get<AddressItem[]>("/shipping-addresses")
  },

  // 地址详情
  details: (id: number) => {
    return request.get<AddressItem>(`/shipping-addresses/${id}`)
  },

  // 添加地址
  add: (params: AddressItem) => {
    return request.post("/shipping-addresses", params)
  },

  // 修改地址
  update: (id: number, params: AddressItem) => {
    return request.patch(`/shipping-addresses/${id}`, params)
  },

  // 删除地址
  delete: (id: number) => {
    return request.delete(`/shipping-addresses/${id}`)
  },

  // 设置默认
  setDefault: (id: number) => {
    return request.patch(`/shipping-addresses/${id}/default`)
  },

  // 获取默认地址
  default: () => {
    return request.get<AddressItem | null>("/shipping-addresses/default")
  }
}
