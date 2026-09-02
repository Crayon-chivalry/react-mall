import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toast, Dialog } from "antd-mobile";
import { EnvironmentOutline } from "antd-mobile-icons";

import { shopApi } from "@/api/shopApi";
import type { OrderItem } from "@/api/types";
import { formatSpecsLabel, formatLocalTime } from "@/utils";
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";
import PaymentPopup from "../components/PaymentPopup";

const paymentMethods: Record<string, string> = {
  alipay: "支付宝",
  wechat: "微信支付",
};

const OrderStatusNames: Record<string, string> = {
  pending: "待付款",
  paid: "待发货",
  shipped: "待收货",
  completed: "已完成",
};

const OrderDetail = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  // 关闭付款弹框
  const closePaymentPopup = () => setVisible(false);

  // 取消订单
  const cancelOrder = () => {
    Dialog.confirm({
      content: "确定要取消订单吗？",
      onConfirm: () => {
        console.log("确定取消");
      },
    });
  };

  // 获取订单信息
  const getOrderDetail = async () => {
    if (!orderId) return;
    const { data: res } = await shopApi.orderDetail(Number(orderId));
    setOrder(res.data);
  };

  useEffect(() => {
    getOrderDetail();
  }, [orderId]);

  return (
    <>
      <AppNavBar title={OrderStatusNames[order?.status || "pending"]} />

      {order && (
        <div className={styles["order-detail"]}>
          {/* 地址 */}
          <div className={styles["address"]}>
            <EnvironmentOutline className={styles["address-icon"]} />
            <div>
              <div className={styles["address-detail"]}>
                <span>
                  {order.province +
                    order.city +
                    order.district +
                    order.detailAddress}
                </span>
              </div>
              <div className={styles["address-label"]}>
                {order.receiverName} {order.receiverPhone}
              </div>
            </div>
          </div>

          {/* 商品 */}
          <div className={styles["order-goods"]}>
            {order.items.map((item) => (
              <div className={styles["goods-item"]} key={item.id}>
                <div className={styles["goods-content"]}>
                  <div className={styles["goods-cover"]}>
                    <img src={item.productCover} />
                  </div>
                  <div>
                    <div className={styles["goods-name"]}>
                      {item.productName}
                    </div>
                    <div className={styles["goods-label"]}>
                      {formatSpecsLabel(item.skuSpecs)}
                    </div>
                  </div>
                </div>
                <div className={styles["goods-right"]}>
                  <div>￥{item.price}</div>
                  <div className={styles["goods-label"]}>x{item.quantity}</div>
                </div>
              </div>
            ))}
            <div className={styles["order-total"]}>
              共1件商品 合计：<strong>¥{order.totalAmount}</strong>
            </div>
          </div>

          {/* 订单信息 */}
          <div className={styles["order-info"]}>
            <div className={styles["info-item"]}>
              <span>订单号</span>
              <span>{order.orderNo}</span>
            </div>
            <div className={styles["info-item"]}>
              <span>支付方式</span>
              <span>{paymentMethods[order.paymentType] || "-"}</span>
            </div>
            <div className={styles["info-item"]}>
              <span>支付时间</span>
              <span>{formatLocalTime(order.createdAt)}</span>
            </div>
            <div className={styles["info-item"]}>
              <span>下单时间</span>
              <span>{formatLocalTime(order.paidAt)}</span>
            </div>
            <div className={styles["info-item"]}>
              <span>配送方式</span>
              <span>-</span>
            </div>
            <div className={styles["info-item"]}>
              <span>留言</span>
              <span>{order.remark || "-"}</span>
            </div>
          </div>

          {/* 操作栏 */}
          <div className={styles["action-bar"]}>
            <div
              className={styles["gray-button"]}
              onClick={() => Toast.show({ content: "暂未开放" })}
            >
              联系客服
            </div>
            {order.status === "pending" && (
              <>
                <div className={styles["gray-button"]} onClick={cancelOrder}>
                  取消订单
                </div>
                <div
                  className={styles["button"]}
                  onClick={() => setVisible(true)}
                >
                  去付款
                </div>
              </>
            )}
          </div>

          {/* 支付弹框 */}
          <PaymentPopup
            visible={visible}
            order={order}
            handleClose={closePaymentPopup}
            success={getOrderDetail}
          />
        </div>
      )}
    </>
  );
};

export default OrderDetail;
