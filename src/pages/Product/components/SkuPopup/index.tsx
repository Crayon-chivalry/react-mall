import { useEffect, useMemo, useState } from "react";
import { Popup, Stepper, Toast } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import type { ProductItem, SkuItem } from "@/api/types";
import styles from "./index.module.scss";

export type SkuPopupMode = "cart" | "buy";

interface SkuPopupProps {
  visible: boolean;
  goods: ProductItem | null;
  /** 弹窗模式：cart=加入购物车 buy=立即购买（控制确认按钮文案和颜色） */
  mode?: SkuPopupMode;
  onClose: () => void;
  /** 点击确认按钮时，把选中的 SKU 和数量回调给父组件 */
  onConfirm: (sku: SkuItem, quantity: number) => void;
}

const SkuPopup = ({
  visible,
  goods,
  mode = "cart",
  onClose,
  onConfirm,
}: SkuPopupProps) => {
  // 已选规格 { 规格名: 规格值 }
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  // 从 skus 中提取规格分组：[{ name: "颜色", values: ["红色", "蓝色"] }]
  // 过滤空规格（单规格商品的 specs 可能为 [{ name: "", value: "" }]）
  const specGroups = useMemo(() => {
    if (!goods) return [];
    const map = new Map<string, string[]>();
    goods.skus.forEach((sku) => {
      sku.specs
        .filter((spec) => spec.name && spec.value)
        .forEach((spec) => {
          const values = map.get(spec.name) ?? [];
          if (!values.includes(spec.value)) {
            values.push(spec.value);
            map.set(spec.name, values);
          }
        });
    });
    return Array.from(map, ([name, values]) => ({ name, values }));
  }, [goods]);

  // 弹窗每次打开时重置选择状态（多规格商品默认选中每组第一个规格）
  useEffect(() => {
    if (visible) {
      const defaultSelected: Record<string, string> = {};
      specGroups.forEach((group) => {
        defaultSelected[group.name] = group.values[0];
      });
      setSelected(defaultSelected);
      setQuantity(1);
    }
  }, [visible, specGroups]);

  // 是否多规格商品
  const isMultiSpec = specGroups.length > 0;

  // 是否已选完所有规格
  const isComplete = specGroups.every((group) => selected[group.name]);

  // 当前选中的 SKU（未选完时为 null，单规格商品取默认 SKU）
  const currentSku = useMemo(() => {
    if (!goods || !isComplete) return null;
    if (!isMultiSpec) {
      return goods.skus.find((sku) => sku.isDefault) ?? goods.skus[0] ?? null;
    }
    return (
      goods.skus.find((sku) =>
        specGroups.every((group) =>
          sku.specs.some(
            (spec) => spec.name === group.name && spec.value === selected[group.name]
          )
        )
      ) ?? null
    );
  }, [goods, specGroups, selected, isComplete, isMultiSpec]);

  // 展示信息：选完规格后取 SKU 信息，否则取商品默认信息
  const price = currentSku?.price ?? goods?.price ?? "";
  const stock = currentSku?.stock ?? goods?.stock ?? 0;
  const cover = currentSku?.cover ?? goods?.cover ?? "";
  const selectedText = specGroups
    .map((group) => selected[group.name])
    .filter(Boolean)
    .join(" / ");

  const handleSelect = (name: string, value: string) => {
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (!currentSku) {
      // 提示未选完的规格
      const missing = specGroups
        .filter((group) => !selected[group.name])
        .map((group) => group.name);
      Toast.show(missing.length ? `请选择${missing.join("、")}` : "该商品暂无可用规格");
      return;
    }
    onConfirm(currentSku, quantity);
  };

  if (!goods) return null;

  return (
    <Popup visible={visible} onMaskClick={onClose} destroyOnClose>
      <div className={styles["sku-popup"]}>
        {/* 头部：图片 / 价格 / 库存 / 已选 */}
        <div className={styles.header}>
          <img className={styles.cover} src={cover} alt={goods.name} />
          <div className={styles.info}>
            <div className={styles.price}>
              ￥<span>{price}</span>
            </div>
            <div className={styles.stock}>库存 {stock}</div>
            {isMultiSpec && (
              <div className={styles.selected}>
                已选：{selectedText || "请选择规格"}
              </div>
            )}
          </div>
          <div className={styles.close} onClick={onClose}>
            <CloseOutline fontSize={16} />
          </div>
        </div>

        {/* 规格选择 + 数量（单规格商品只渲染数量） */}
        <div className={styles.body}>
          {isMultiSpec &&
            specGroups.map((group) => (
              <div key={group.name} className={styles.group}>
                <div className={styles["group-name"]}>{group.name}</div>
                <div className={styles.options}>
                  {group.values.map((value) => (
                    <div
                      key={value}
                      className={`${styles.option} ${
                        selected[group.name] === value ? styles.active : ""
                      }`}
                      onClick={() => handleSelect(group.name, value)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* 数量选择 */}
          <div className={`${styles.group} ${styles["quantity-group"]}`}>
            <div className={styles["group-name"]}>数量</div>
            <Stepper
              min={1}
              max={stock || 1}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
            />
          </div>
        </div>

        {/* 确认按钮 */}
        <div className={styles.footer}>
          <div
            className={`${styles.confirm} ${
              mode === "cart" ? styles["confirm-cart"] : styles["confirm-buy"]
            }`}
            onClick={handleConfirm}
          >
            {mode === "cart" ? "加入购物车" : "立即购买"}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SkuPopup;
