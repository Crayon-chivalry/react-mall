import request from "./request";
import type { ApiResponse, Pagination } from './types'

export const shopApi = {
  categories: (params: Pagination) => {
    return request.get<ApiResponse>("/categories", {params})
  }
}