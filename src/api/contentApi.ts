import request from "./request";
import type { BannerItem, EntriesItem, PromoSectionsItem } from "./types";

export const contentApi = {
  // 获取轮播图
  banners: () => {
    return request.get<BannerItem[]>("/banners")
  },

  // 金刚区
  homeEntries: () => {
    return request.get<EntriesItem[]>("/home-entries");
  },

  // 首页广告位
  promoSections: () => {
    return request.get<PromoSectionsItem[]>("/promo-sections");
  },
};
