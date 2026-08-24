import { useNavigate } from "react-router-dom";
import { ErrorBlock} from 'antd-mobile'
import Masonry from "react-masonry-css";

import type { ProductItem } from "@/api/types"
import styles from "./index.module.scss";

type GoodsListProps = {
  list: ProductItem[]
}

const ProductCard = ({ list }: GoodsListProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Masonry breakpointCols={2} className={styles["my-masonry-grid"]}>
        {list.map((item: ProductItem) => (
          <div
            className={styles["goods-item"]}
            key={item.id}
            onClick={() => navigate("/product?id=" + item.id)}
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

      {list.length === 0 && <ErrorBlock status='empty' />}
    </>
  );
};

export default ProductCard;
