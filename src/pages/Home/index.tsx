import { useNavigate } from "react-router-dom";
import { Swiper } from "antd-mobile";
import { ScanningOutline, BellOutline, SearchOutline } from "antd-mobile-icons";

import type { GoodsItem } from "@/api/types";
import GoodsList from "@/components/GoodsList";
import styles from "./index.module.scss";

// 金刚区
const appList = [
  { name: "海外购", image: "/src/assets/images/home-grid1.png" },
  { name: "新人专享", image: "/src/assets/images/home-grid2.png" },
  { name: "直播", image: "/src/assets/images/home-grid3.png" },
  { name: "积分商城", image: "/src/assets/images/home-grid4.png" },
  { name: "附近门店", image: "/src/assets/images/home-grid5.png" },
];

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

  const handleNavigate = (path: string) => {
    navigate(path);
  };

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
      </div>

      <Swiper indicatorProps={{ color: "white" }} className={styles["swiper"]}>
        <Swiper.Item>
          <img
            src="/src/assets/images/home-swiper.png"
            className={styles["swiper-image"]}
          />
        </Swiper.Item>
      </Swiper>

      <div className={styles["navigation"]}>
        {appList.map((item, index) => (
          <div className={styles["navigation-item"]} key={index}>
            <img src={item.image} className={styles["navigation-cover"]} />
            <div>{item.name}</div>
          </div>
        ))}
      </div>

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
