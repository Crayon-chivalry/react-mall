import request from "./request";
import type { ApiResponse } from './types'

export const contentApi = {
  // 获取轮播图
  banners: () => {
    return request.get<ApiResponse>("/banners")
  },

  homeEntries: () => {
    return request.get<ApiResponse>("/home-entries")
  }
}

