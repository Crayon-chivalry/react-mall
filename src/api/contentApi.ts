import request from "./request";
import type { ApiResponse, EntriesItem, PromoSectionsItem } from "./types";

export const contentApi = {
  // 获取轮播图
  banners: () => {
    return request.get<ApiResponse>("/banners")
  },

  // 金刚区
  homeEntries: () => {
    return request.get<ApiResponse<EntriesItem[]>>("/home-entries");
  },

  // 首页广告位
  promoSections: () => {
    return request.get<ApiResponse<PromoSectionsItem[]>>("/promo-sections");
  },
};

