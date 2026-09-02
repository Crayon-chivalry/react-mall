import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, InfiniteScroll, Dialog, ErrorBlock } from "antd-mobile";

import type { OrderItem, OrderStatus } from "@/api/types";
import { shopApi } from "@/api/shopApi";
import { formatSpecsLabel } from "@/utils/index";
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";
import PaymentPopup from "../components/PaymentPopup";

type OrderTabStatus = OrderStatus | "all";

const statusList = [
  { name: "全部", value: "all" },
  { name: "待付款", value: "pending" },
  { name: "待发货", value: "paid" },
  { name: "待收货", value: "shipped" },
  { name: "已完成", value: "completed" },
] satisfies { name: string; value: OrderTabStatus }[];

const isValidTabStatus = (value: string | null): value is OrderTabStatus =>
  !!value && statusList.some((item) => item.value === value);

const statusNames: Record<OrderStatus, string> = {
  pending: "待付款",
  paid: "待发货",
  shipped: "待收货",
  completed: "已完成",
};

const OrderList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramsStatus = searchParams.get("status");
  const [status, setStatus] = useState<OrderTabStatus>(
    isValidTabStatus(paramsStatus) ? paramsStatus : "all",
  );
  const [list, setList] = useState<OrderItem[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(null);

  // 关闭付款弹框
  const closePaymentPopup = () => setVisible(false);

  // tabs 变化
  const onChange = (key: string) => {
    console.log(key);
    setStatus(key as OrderTabStatus);
  };

  // 点击去付款按钮, 显示付款弹框
  const paymentClick = (e: React.MouseEvent, item: OrderItem) => {
    e.stopPropagation();
    setActiveOrder(item);
    setVisible(true);
  };


  const loadMore = async () => {
    await console.log("加载更多");
  }

  // 取消订单
  const cancelOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    Dialog.confirm({
      content: "确定要取消订单吗？",
      onConfirm: () => {
        console.log("确定取消");
      },
    });
  };

  // 获取订单列表
  const getOrderList = async () => {
    const { data: res } = await shopApi.orderList({
      page: 1,
      pageSize: 10,
      ...(status !== "all" ? { status } : {}),
    });
    console.log(res);
    setList(res.data.list);
  };

  useEffect(() => {
    getOrderList();
  }, [status]);

  return (
    <>
      <AppNavBar title="我的订单" />

      {/* 标签栏 */}
      <Tabs activeKey={status} className={styles["tabs"]} onChange={onChange}>
        {statusList.map((item) => (
          <Tabs.Tab title={item.name} key={item.value}></Tabs.Tab>
        ))}
      </Tabs>

      {/* 列表 */}
      <div className={styles["order-list"]}>
        {list.map((item) => (
          <div
            className={styles["order-item"]}
            key={item.id}
            onClick={() => navigate(`/order/detail?id=${item.id}`)}
          >
            <div className={styles["order-header"]}>
              <div className={styles["order-no"]}>订单号：{item.orderNo}</div>
              <div className={styles["order-status"]}>
                {statusNames[item.status]}
              </div>
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
                      <div className={styles["goods-label"]}>
                        {formatSpecsLabel(p.skuSpecs)}
                      </div>
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

              {item.status === "pending" && (
                <div className={styles["btn-wrap"]}>
                  <div className={styles["gray-button"]} onClick={cancelOrder}>
                    取消订单
                  </div>
                  <div
                    className={styles["button"]}
                    onClick={(e) => paymentClick(e, item)}
                  >
                    去付款
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <InfiniteScroll loadMore={loadMore} hasMore={true} />

      {list.length === 0 && <ErrorBlock status="empty" />}

      {/* 支付弹框 */}
      <PaymentPopup
        visible={visible}
        order={activeOrder}
        handleClose={closePaymentPopup}
      />
    </>
  );
};

export default OrderList;
