import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Toast } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";

import useUserStore from "@/store/userStore";
import { maskPhone } from "@/utils/index";
import type { OrderStatus } from "@/api/types";
import { shopApi } from "@/api/shopApi";
import styles from "./index.module.scss";

interface OrderItem {
  name: string;
  icon: string;
  status: OrderStatus;
}

type OrderBadgeMap = Partial<Record<OrderStatus, number>>;

const orderItems: OrderItem[] = [
  { name: "待付款", icon: "/src/assets/images/order1.png", status: "pending" },
  { name: "待发货", icon: "/src/assets/images/order2.png", status: "paid" },
  { name: "待收货", icon: "/src/assets/images/order3.png", status: "shipped" },
  {
    name: "已完成",
    icon: "/src/assets/images/order4.png",
    status: "completed",
  },
];

const actionsItems = [
  {
    name: "地址管理",
    icon: "/src/assets/images/address.png",
    path: "/address",
  },
  { name: "客服中心", icon: "/src/assets/images/service.png", path: "" },
  { name: "设置", icon: "/src/assets/images/settings.png", path: "/settings" },
];

const User = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [badges, setBadges] = useState<OrderBadgeMap>({
    pending: 0,
    paid: 0,
    shipped: 0,
  });

  // 跳转页面
  const handleNavigate = (path: string) => {
    if (!path) {
      Toast.show({ content: "暂未开放" });
      return;
    }
    navigate(path);
  };

  // 获取订单徽标数
  const getOrderBadges = async () => {
    const { data: res } = await shopApi.orderBadges();
    setBadges(res.data);
  };

  useEffect(() => {
    getOrderBadges();
  }, []);

  return (
    <>
      <div className={styles["user"]}>
        <img src="/src/assets/images/tx.png" className={styles["avatar"]} />
        <div>
          <div className={styles["user-name"]}>{user?.nickname}</div>
          <div className={styles["user-phone"]}>{maskPhone(user?.phone)}</div>
        </div>
      </div>

      <div className={styles["cards"]}>
        <Card
          title="我的订单"
          extra={
            <div
              className={styles["extra"]}
              onClick={() => navigate("/order/list")}
            >
              <span>全部订单</span>
              <RightOutline />
            </div>
          }
        >
          <div className={styles["order"]}>
            {orderItems.map((item) => (
              <div
                key={item.name}
                className={styles["order-item"]}
                onClick={() => navigate(`/order/list?status=${item.status}`)}
              >
                <Badge content={badges[item.status] || null}>
                  <img src={item.icon} className={styles["order-image"]} />
                  <div>{item.name}</div>
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="功能服务">
          <div className={styles["actions"]}>
            {actionsItems.map((item, index) => (
              <div
                key={index}
                className={styles["actions-item"]}
                onClick={() => handleNavigate(item.path)}
              >
                <img
                  src={item.icon}
                  className={styles["actions-image"]}
                />
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default User;
