import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper } from "antd-mobile";
import { ScanningOutline, BellOutline, SearchOutline } from "antd-mobile-icons";

import GoodsList from "@/components/GoodsList";
import type { GoodsItem, BannerItem } from "@/api/types";
import styles from "./index.module.scss";
import { contentApi } from "@/api/contentApi";
import HomeNavGrid from "./components/HomeNavGrid";

// 静态商品列表
const goodsList: GoodsItem[] = [
  {
    id: 1,
    name: "SK-II神仙水精华液面霜保湿紧致护肤礼盒礼物",
    price: 2448,
    cover: "/src/assets/images/goods/SK-II.jpg",
  },
  {
    id: 2,
    name: "心相印茶语抽纸整箱",
    price: 26.91,
    cover: "/src/assets/images/goods/zhijin.jpg",
  },
  {
    id: 3,
    name: "豆本豆唯甄原味豆奶250ml*24盒营养早餐奶多口味植物蛋白饮品整箱",
    price: 29.31,
    cover: "/src/assets/images/goods/dounai.jpg",
  },
  {
    id: 4,
    name: "海信空调易省电ProE370大3匹一级变频家用客厅立式柜机",
    price: 3569.06,
    cover: "/src/assets/images/goods/haixin.jpg",
  },
  {
    id: 5,
    name: "OPPO一加 Ace 5 新品学生游戏性能手机第三代骁龙 8",
    price: 1982.7,
    cover: "/src/assets/images/goods/ace5.jpg",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [entries, serEntries] = useState([]);

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
    serEntries(res.data);
  };

  useEffect(() => {
    getBanners();
    getEntries();
  }, []);

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["header-row"]}>
          <ScanningOutline />
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

      <GoodsList list={goodsList} />
    </>
  );
};

export default Home;
