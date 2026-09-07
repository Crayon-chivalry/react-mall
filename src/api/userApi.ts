import request from "./request";
import type { ApiResponse, RegisterParams, LoginParams, UpdatePasswordParams, UpdateProfileParams } from './types'

export const userApi = {
  // 注册
  register: (params: RegisterParams) => {
    return request.post<ApiResponse>("/users", params)
  },

  // 登录
  login: (params: LoginParams) => {
    return request.post<ApiResponse>("/auth/login", params)
  },

  // 修改密码
  updatePassword: (params: UpdatePasswordParams) => {
    return request.post<ApiResponse>("/users/password", params)
  },

  // 修改资料
  updateProfile: (params: UpdateProfileParams) => {
    return request.patch<ApiResponse>("/users/profile", params)
  },
}