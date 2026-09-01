import { useState } from 'react';
import { Popup, Radio, Divider, Toast } from 'antd-mobile'

import type { OrderItem } from "@/api/types"
import styles from "./index.module.scss"
import { shopApi } from '@/api/shopApi';
import AppNavBar from '@/components/AppNavBar';


interface PaymentProps {
  visible: boolean
  order: OrderItem | null
  handleClose: () => void
  success?: () => void
}

interface PaymentTypeInterface {
  name: string
  type: string
  icon: string
}

const paymentTypes: PaymentTypeInterface[] = [
  {name: "支付宝", type: "alipay", icon: "/src/assets/images/alipay.png"},
  {name: "微信支付", type: "wechat", icon: "/src/assets/images/wechat.png"}
]

const PaymentPopup = ({visible, order, handleClose, success}: PaymentProps) => {
  const [type, setType] = useState<string>(paymentTypes[0].type)  

  // 确认支付
  const confirmPayment = async () => {
    if(!order) {
      Toast.show({
        content: "订单不存在",
        icon: "fail"
      });
      return
    }
    const { data: res } = await shopApi.orderPayment(order.id, type)
    Toast.show({
      content: res.message,
      icon: "success"
    });
    setTimeout(() => {
      handleClose()
      success?.()
    }, 1000)
  }

  return (
    <Popup
      visible={visible}
      position="right"
      bodyStyle={{ width: "100vw" }}
    >
      <AppNavBar title="收银台" onBack={handleClose} />

      <div className={styles["total"]}>
        <div>实付金额</div>
        <div>￥<span className={styles["amount"]}>{order?.totalAmount}</span></div>
      </div>

      <Divider />

      <div className={styles["types"]}>
        <div className={styles["types-title"]}>选中支付方式</div>
        <Radio.Group defaultValue={type} onChange={(val) => setType(String(val))}>
          {paymentTypes.map(item => (
            <div className={styles["type-item"]} key={item.type}>
              <div className={styles["type-left"]}>
                <img src={item.icon} className={styles["type-icon"]} />
                {item.name}
              </div>
              <Radio value={item.type}></Radio>
            </div>
          ))}
        </Radio.Group>
      </div>

      <div className={styles["btn"]} onClick={confirmPayment}>支付￥{order?.totalAmount}</div>
    </Popup>
  );
};

export default PaymentPopup;
