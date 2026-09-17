import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, Toast, InfiniteScroll } from "antd-mobile";
import { ScanningOutline, BellOutline, SearchOutline } from "antd-mobile-icons";

import ProductCard from "@/components/ProductCard";
import type { ProductItem, BannerItem } from "@/api/types";
import styles from "./index.module.scss";
import { contentApi } from "@/api/contentApi";
import { shopApi } from "@/api/shopApi";
import { navigateByLink } from "@/utils";
import usePagination from "@/hooks/usePagination";
import NavGrid from "./components/NavGrid";
import PromoSections from "./components/PromoSections";

const Home = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<BannerItem[]>([]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // 获取轮播图
  const getBanners = async () => {
    const { data: res } = await contentApi.banners();
    setBanners(res.data);
  };

  // 获取商品列表
  const { list, hasMore, refresh, loadMore } = usePagination<ProductItem>({
    fetcher: async (page, pageSize) => {
      const { data: res } = await shopApi.goodsList({
        page,
        pageSize,
      });
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      };
    },
    pageSize: 10,
    autoLoad: false,
  });

  useEffect(() => {
    getBanners();
    void refresh();
  }, []);

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["header-row"]}>
          <ScanningOutline
            onClick={() => Toast.show({ content: "暂未开放" })}
          />
          <div
            className={styles["search"]}
            onClick={() => handleNavigate("/search")}
          >
            <SearchOutline />
            <div>请输入内容</div>
          </div>
          <BellOutline onClick={() => handleNavigate("notice")} />
        </div>
        <div className={styles["swiper"]}>
          {/* 还需要处理点击链接的部分 */}
          <Swiper autoplay loop indicatorProps={{ color: "white" }}>
            {banners.map((item) => (
              <Swiper.Item key={item.id}>
                <img
                  src={item.imageUrl}
                  className={styles["swiper-image"]}
                  alt={item.title}
                  onClick={() => navigateByLink(item.linkUrl, navigate)}
                />
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 金刚区 */}
      <div className={styles["navigation"]}>
        <NavGrid pageSize={10} />
      </div>

      {/* 活动专区 */}
      <PromoSections />

      {/* 商品 */}
      <ProductCard list={list} />
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );
};

export default Home;
