import { useEffect, useState } from "react";
import { Tag, Input, Toast } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";

import { addressApi } from "@/api/addressApi";
import type { AddressItem } from "@/api/types";
import { shopApi } from "@/api/shopApi";
import useProductStore from "@/store/productStore";
import { formatSpecsLabel } from "@/utils";
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";
import PaymentPopup from "../components/PaymentPopup";

const OrderConfirm = () => {
  const checkoutItems = useProductStore((state) => state.checkoutItems);
  const [address, setAddress] = useState<AddressItem | null>(null);
  const [remark, setRemark] = useState<string>("")
  const [visible, setVisible] = useState<boolean>(false);
  // 总计
  const totalAmount = checkoutItems.reduce(
    (total, item) => total + Number(item.sku.price),
    0,
  );

  // 获取默认地址
  const getAddressDefault = async () => {
    const { data: res } = await addressApi.default();
    setAddress(res.data);
  };

  // 提交订单
  const submitOrder = async () => {
    if (!address) {
      Toast.show({
        content: "请先添加收货地址",
      });
      return;
    }
    const { data: res } = await shopApi.orderCreate({
      shippingAddressId: address?.id,
      items: checkoutItems.map((item) => ({
        productId: item.product.id,
        skuId: item.sku.id,
        quantity: item.quantity,
      })),
      remark: remark,
    });
    Toast.show({
      content: res.message,
      icon: "success"
    });
    console.log(res);
  };

  useEffect(() => {
    getAddressDefault();
  }, []);

  return (
    <>
      <AppNavBar title="确认订单" />

      {/* 收货地址 */}
      {address && (
        <div className={styles["address"]}>
          <div>
            <div className={styles["address-detail"]}>
              <Tag color="primary" fill="outline">
                默认
              </Tag>
              <span>{address.detailAddress}</span>
            </div>
            <div className={styles["address-label"]}>
              {address.receiverName} {address.receiverPhone}
            </div>
          </div>
          <RightOutline />
        </div>
      )}

      {/* 商品 */}
      <div className={styles["goods"]}>
        {checkoutItems.map((item) => (
          <div className={styles["goods-item"]} key={item.sku.id}>
            <div className={styles["goods-cover"]}>
              <img src={item.sku.cover || item.product.cover} />
            </div>
            <div className={styles["goods-content"]}>
              <div>
                <div className={styles["goods-name"]}>{item.product.name}</div>
                <div className={styles["goods-label"]}>
                  {formatSpecsLabel(item.sku.specs)}
                </div>
              </div>
              <div className={styles["goods-cell"]}>
                <div className={styles["goods-price"]}>￥{item.sku.price}</div>
                <div className={styles["goods-quantity"]}>x{item.quantity}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["cells"]}>
        <div className={styles["cell"]}>
          <div>配送方式</div>
          <div>普通快递</div>
        </div>
        <div className={styles["cell"]}>
          <div>优惠券</div>
          <div>无</div>
        </div>
        <div>
          <div>买家留言</div>
          <div className={styles["input-wrap"]}>
            <Input placeholder="给商家留言（选填）" onChange={val => setRemark(val)} />
          </div>
        </div>
      </div>

      <div className={styles["cells"]}>
        <div className={styles["cell"]}>
          <div>商品金额</div>
          <div>￥{totalAmount}</div>
        </div>
        <div className={styles["cell"]}>
          <div>运费</div>
          <div>￥0</div>
        </div>
        <div className={styles["cell"]}>
          <div>优惠</div>
          <div>-￥0</div>
        </div>
        <div className={styles["cell-footer"]}>
          <div>
            小计：<span className={styles["amount"]}>￥{totalAmount}</span>
          </div>
        </div>
      </div>

      <div className={styles["placeholder"]}></div>
      <div className={styles["submit-bar"]}>
        <div className={styles["btn"]} onClick={submitOrder}>
          立即支付 ￥{totalAmount}
        </div>
      </div>

      {/* 支付弹框 */}
      <PaymentPopup visible={visible} />
    </>
  );
};

export default OrderConfirm;
