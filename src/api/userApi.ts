import request from "./request";
import type { ApiResponse, RegisterParams, LoginParams } from './types'

export const userApi = {
  // 注册
  register: (params: RegisterParams) => {
    return request.post<ApiResponse>("/users", params)
  },

  // 登录
  login: (params: LoginParams) => {
    return request.post<ApiResponse>("/auth/login", params)
  }
}