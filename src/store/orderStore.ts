import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { OrderItem } from "@/api/types";

interface OrderStore {
  paymentOrder: OrderItem | null;
  /** 设置当前待支付订单，支付弹框会根据它恢复显示 */
  setPaymentOrder: (order: OrderItem | null) => void;
  /** 清空当前待支付订单，支付成功/取消后调用 */
  clearPaymentOrder: () => void;
}

const useOrderStore = create<OrderStore>()(persist((set) => ({
  paymentOrder: null,
  setPaymentOrder: (order) => set({ paymentOrder: order }),
  clearPaymentOrder: () => set({ paymentOrder: null }),
}), {
  name: "mall-order",
  partialize: (state) => ({
    paymentOrder: state.paymentOrder,
  }),
}));

export default useOrderStore;
