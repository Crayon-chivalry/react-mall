import { useEffect, useState } from "react";
import { Tabs, Button } from "antd-mobile";

import type { OrderItem } from "@/api/types";
import { shopApi } from "@/api/shopApi";
import { formatSpecsLabel } from "@/utils/index";
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";
import PaymentPopup from "../components/PaymentPopup"

const tabs = [
  { name: "全部", value: 99 },
  { name: "待付款", value: 0 },
  { name: "待发货", value: 1 },
  { name: "待收货", value: 2 },
  { name: "待评价", value: 3 },
];

const OrderList = () => {
  const [activeKey, setActiveKey] = useState<string>("99");
  const [list, setList] = useState<OrderItem[]>([]);
  const [visible, setVisible] = useState<boolean>(false)
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(null)

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  // 点击去付款按钮, 显示付款弹框
  const paymentClick = (item: OrderItem) => {
    setActiveOrder(item)
    setVisible(true)
  }

  // 获取订单列表
  const getOrderList = async () => {
    const { data: res } = await shopApi.orderList({
      page: 1,
      pageSize: 10,
    });
    console.log(res);
    setList(res.data.list);
  };

  useEffect(() => {
    getOrderList();
  }, []);

  return (
    <>
      <AppNavBar title="我的订单" />

      <Tabs
        activeKey={activeKey}
        className={styles["tabs"]}
        onChange={onChange}
      >
        {tabs.map((item) => (
          <Tabs.Tab title={item.name} key={item.value}></Tabs.Tab>
        ))}
      </Tabs>

      <div className={styles["order-list"]}>
        {list.map((item) => (
          <div className={styles["order-item"]} key={item.id}>
            <div className={styles["order-header"]}>
              <div className={styles["order-no"]}>订单号：{item.orderNo}</div>
              <div className={styles["order-status"]}>待付款</div>
            </div>
            <div className={styles["order-goods"]}> 
              {item.items.map((p) => (
                <div className={styles["goods-item"]} key={p.id}>
                  <div className={styles["goods-content"]}>
                    <div className={styles["goods-cover"]}>
                      <img src={p.productCover} />
                    </div>
                    <div>
                      <div className={styles["goods-name"]}>
                        {p.productName}
                      </div>
                      <div className={styles["goods-label"]}>{formatSpecsLabel(p.skuSpecs)}</div>
                    </div>
                  </div>
                  <div className={styles["goods-right"]}>
                    <div>￥{p.price}</div>
                    <div className={styles["goods-label"]}>x{p.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles["order-footer"]}>
              <div className={styles["order-total"]}>
                共1件商品 合计：<strong>¥{item.totalAmount}</strong>
              </div>
              <div className={styles["btn-wrap"]}>
                <Button size="small" shape='rounded'>
                  取消订单
                </Button>
                <Button color="primary" size="small" shape='rounded' onClick={() => paymentClick(item)}>
                  去付款
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 支付弹框 */}
      <PaymentPopup visible={visible} order={activeOrder} />
    </>
  );
};

export default OrderList;
