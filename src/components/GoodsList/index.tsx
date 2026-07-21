import { useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";

import type { GoodsItem } from "@/api/types"
import styles from "./index.module.scss";

type GoodsListProps = {
  list: GoodsItem[]
}

const GoodsList = ({ list }: GoodsListProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/goods");
  };

  return (
    <Masonry breakpointCols={2} className={styles["my-masonry-grid"]}>
      {list.map((item: GoodsItem) => (
        <div
          className={styles["goods-item"]}
          key={item.id}
          onClick={handleClick}
        >
          <img src={item.cover} className={styles["goods-cover"]} />
          <div className={styles["goods-content"]}>
            <div className={styles["goods-name"]}>{item.name}</div>
            <div className={styles["goods-price"]}>
              ￥<span>{item.price}</span>
            </div>
          </div>
        </div>
      ))}
    </Masonry>
  );
};

export default GoodsList;
