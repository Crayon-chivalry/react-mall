import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, Toast } from "antd-mobile";
import { ScanningOutline, BellOutline, SearchOutline } from "antd-mobile-icons";

import ProductCard from "@/components/ProductCard";
import type { ProductItem, BannerItem, EntriesItem } from "@/api/types";
import styles from "./index.module.scss";
import { contentApi } from "@/api/contentApi";
import { shopApi } from "@/api/shopApi";
import HomeNavGrid from "./components/HomeNavGrid";

const Home = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [entries, setEntries] = useState<EntriesItem[]>([]);
  const [goods, setGoods] = useState<ProductItem[]>([])

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // 获取轮播图
  const getBanners = async () => {
    const { data: res } = await contentApi.banners();
    setBanners(res.data);
  };

  // 获取金刚区
  const getEntries = async () => {
    const { data: res } = await contentApi.homeEntries();
    setEntries(res.data);
  };

  // 获取商品列表
  const getGoods = async () => {
    const { data: res } = await shopApi.goodsList({ page: 1, pageSize: 100 })
    setGoods(res.data.list)
  }

  useEffect(() => {
    getBanners();
    getEntries();
    getGoods()
  }, []);

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["header-row"]}>
          <ScanningOutline onClick={() => Toast.show({content: "暂未开放"})} />
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
                <img src={item.imageUrl} className={styles["swiper-image"]} />
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 金刚区 */}
      {entries.length > 0 && (
        <div className={styles["navigation"]}>
          <HomeNavGrid items={entries} pageSize={10} />
        </div>
      )}

      {/* 活动专区 */}
      <img
        src="/src/assets/images/home-banner.png"
        className={styles["banner"]}
      />

      <div className={styles["banner-grid"]}>
        <div className={styles["banner-grid-item"]}>
          <img
            src="/src/assets/images/banner-grid-left.png"
            className={styles["banner-grid-img"]}
          />
        </div>
        <div className={styles["banner-grid-item"]}>
          <img
            src="/src/assets/images/banner-grid-right1.png"
            className={styles["banner-grid-img"]}
          />
          <img
            src="/src/assets/images/banner-grid-right2.png"
            className={styles["banner-grid-img"]}
          />
        </div>
      </div>

      <ProductCard list={goods} />
    </>
  );
};

export default Home;
