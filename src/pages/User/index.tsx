import { useNavigate } from "react-router-dom";
import { Card } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";

import useUserStore from "@/store/userStore";
import { maskPhone } from "@/utils/index";
import styles from "./index.module.scss";

const User = () => {
  const navigate = useNavigate();
  const { user } = useUserStore()

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className={styles["user"]}>
        <img src="/src/assets/images/tx.png" className={styles["avatar"]} />
        <div>
          <div className={styles["user-name"]}>{ user?.nickname }</div>
          <div className={styles["user-phone"]}>{ maskPhone(user?.phone) }</div>
        </div>
      </div>

      <div className={styles["cards"]}>
        <Card
          title="我的订单"
          extra={
            <div className={styles["extra"]} onClick={() => navigate("/order/list")}>
              <span>全部订单</span>
              <RightOutline />
            </div>
          }
        >
          <div className={styles["order"]}>
            <div className={styles["order-item"]}>
              <img
                src="/src/assets/images/order1.png"
                className={styles["order-image"]}
              />
              <div>待付款</div>
            </div>
            <div className={styles["order-item"]}>
              <img
                src="/src/assets/images/order2.png"
                className={styles["order-image"]}
              />
              <div>待发货</div>
            </div>
            <div className={styles["order-item"]}>
              <img
                src="/src/assets/images/order3.png"
                className={styles["order-image"]}
              />
              <div>待收货</div>
            </div>
            <div className={styles["order-item"]}>
              <img
                src="/src/assets/images/order4.png"
                className={styles["order-image"]}
              />
              <div>待评价</div>
            </div>
            <div className={styles["order-item"]}>
              <img
                src="/src/assets/images/order5.png"
                className={styles["order-image"]}
              />
              <div>退款/售后</div>
            </div>
          </div>
        </Card>

        <Card title="功能服务">
          <div className={styles["actions"]}>
            <div
              className={styles["actions-item"]}
              onClick={() => handleNavigate("/invite")}
            >
              <img
                src="/src/assets/images/invite.png"
                className={styles["actions-image"]}
              />
              <div>邀请好友</div>
            </div>
            <div
              className={styles["actions-item"]}
              onClick={() => handleNavigate("/address")}
            >
              <img
                src="/src/assets/images/address.png"
                className={styles["actions-image"]}
              />
              <div>地址管理</div>
            </div>
            <div className={styles["actions-item"]}>
              <img
                src="/src/assets/images/service.png"
                className={styles["actions-image"]}
              />
              <div>客服中心</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default User;
