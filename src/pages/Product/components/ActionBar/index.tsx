import { useNavigate } from "react-router-dom";
import { Toast } from 'antd-mobile'

import styles from "./index.module.scss";

interface ActionBarProps {
  /** 点击"加入购物车" */
  onAddCart?: () => void;
  /** 点击"立即购买" */
  onBuy?: () => void;
}

const ActionBar = ({ onAddCart, onBuy }: ActionBarProps) => {
  const navigate = useNavigate()

  return (
    <>
      <div className={styles["placeholder"]}></div>

      <div className={styles["action-bar"]}>
        <div className={styles["bar-icons"]}>
          <div className={styles["icon-item"]} onClick={() => Toast.show({content: "暂未开放"})}>
            <img
              src="/src/assets/images/bar-service.png"
              className={styles["icon"]}
            />
            <div>客服</div>
          </div>
          <div className={styles["icon-item"]} onClick={() => navigate("/Cart")}>
            <img
              src="/src/assets/images/bar-cart.png"
              className={styles["icon"]}
            />
            <div>购物车</div>
          </div>
        </div>
        <div className={styles["action-btns"]}>
          <div className={styles["btn"]} onClick={onAddCart}>加入购物车</div>
          <div className={styles["btn"]} onClick={onBuy}>立即购买</div>
        </div>
      </div>
    </>
  );
};

export default ActionBar;
