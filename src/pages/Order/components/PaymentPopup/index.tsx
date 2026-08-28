import { Popup, Radio, Divider } from 'antd-mobile'

import type { OrderItem } from "@/api/types"
import styles from "./index.module.scss"
import AppNavBar from '@/components/AppNavBar';

interface PaymentProps {
  visible: boolean
  order: OrderItem | null
}

interface PayTypeInterface {
  name: string
  type: string
  icon: string
}

const paymentTypes: PayTypeInterface[] = [
  {name: "支付宝", type: "alipay", icon: "/src/assets/images/alipay.png"},
  {name: "微信支付", type: "wechat", icon: "/src/assets/images/wechat.png"}
]

const PaymentPopup = ({visible, order}: PaymentProps) => {
  return (
    <Popup
      visible={visible}
      position="right"
      bodyStyle={{ width: "100vw" }}
    >
      <AppNavBar title="收银台" />

      <div className={styles["total"]}>
        <div>实付金额</div>
        <div>￥<span className={styles["amount"]}>{order?.totalAmount}</span></div>
      </div>

      <Divider />

      <div className={styles["types"]}>
        <div className={styles["types-title"]}>选中支付方式</div>
        <Radio.Group defaultValue="alipay">
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

      <div className={styles["btn"]}>支付￥{order?.totalAmount}</div>
    </Popup>
  );
};

export default PaymentPopup;
