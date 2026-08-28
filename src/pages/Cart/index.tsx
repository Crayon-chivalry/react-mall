import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper, Checkbox, SwipeAction, ErrorBlock } from "antd-mobile";

import AppNavBar from "@/components/AppNavBar";
import styles from "./inedx.module.scss";
import { formatSpecsLabel } from "@/utils";
import useProductStore from "@/store/productStore";

const Cart = () => {
  const navigate = useNavigate();

  const setCartItemChecked = useProductStore(
    (state) => state.setCartItemChecked,
  );
  const setAllCartItemsChecked = useProductStore(
    (state) => state.setAllCartItemsChecked,
  );
  const updateCartItemQuantity = useProductStore(
    (state) => state.updateCartItemQuantity,
  );
  const removeCartItem = useProductStore((state) => state.removeCartItem);
  const removeCartItems = useProductStore((state) => state.removeCartItems);
  const setCheckoutItems = useProductStore((state) => state.setCheckoutItems);

  const cartList = useProductStore((state) => state.cartList);
  const allChecked =
    cartList.length > 0 && cartList.every((item) => item.checked);
  const [isEdit, setIsEdit] = useState(false);

  // 计算合计
  const totalAmount = useMemo(() => {
    return cartList
      .filter((item) => item.checked)
      .reduce(
        (total, item) => total + Number(item.sku.price) * item.quantity,
        0,
      );
  }, [cartList]);

  // 勾选商品数量
  const checkedItemCount = cartList.filter((item) => item.checked).length;

  // 批量删除
  const handleDeleteChecked = () => {
    removeCartItems(
      cartList
        .filter((item) => item.checked)
        .map((item) => ({
          productId: item.product.id,
          skuId: item.sku.id,
        })),
    );
    setIsEdit(false)
  };

  // 结算
  const submit = () => {
    setCheckoutItems(cartList.filter((item) => item.checked))
    navigate("/order/confirm") 
  }

  return (
    <>
      {/* 顶部 */}
      <AppNavBar
        title="购物车"
        back={null}
        right={
          <div onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "完成" : "编辑"}
          </div>
        }
      />

      {/* 商品 */}
      <div className={styles["goods"]}>
        {cartList.map((item) => (
          <SwipeAction
            key={item.sku.id}
            rightActions={[
              {
                key: "delete",
                text: "删除",
                color: "danger",
                onClick: () => removeCartItem(item.product.id, item.sku.id),
              },
            ]}
          >
            <div
              className={styles["goods-item"]}
              onClick={() => navigate("/product?id=" + item.product.id)}
            >
              <Checkbox
                checked={item.checked}
                onClick={(event) => event.stopPropagation()}
                onChange={(checked) =>
                  setCartItemChecked(item.product.id, item.sku.id, checked)
                }
                style={{ "--icon-size": "18px" }}
              />
              <div className={styles["goods-cover"]}>
                <img src={item.sku.cover || item.product.cover} />
              </div>
              <div className={styles["goods-content"]}>
                <div>
                  <div className={styles["goods-name"]}>
                    {item.product.name}
                  </div>
                  <div className={styles["goods-label"]}>
                    {formatSpecsLabel(item.sku.specs)}
                  </div>
                </div>
                <div className={styles["goods-cell"]}>
                  <div className={styles["goods-price"]}>
                    ￥{item.sku.price}
                  </div>
                  <div onClick={(event) => event.stopPropagation()}>
                    <Stepper
                      defaultValue={item.quantity}
                      min={1}
                      max={item.product.stock}
                      onChange={(quantity) =>
                        updateCartItemQuantity(
                          item.product.id,
                          item.sku.id,
                          quantity,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwipeAction>
        ))}
        {cartList.length === 0 && <ErrorBlock status='empty' title="购物车空空如也" description="心仪的都加进来" />}
      </div>

      {/* 动作栏 */}
      <div className={styles["submit-bar"]}>
        <div className={styles["submit-left"]}>
          <Checkbox
            checked={allChecked}
            indeterminate={cartList.some((item) => item.checked) && !allChecked}
            onChange={setAllCartItemsChecked}
            style={{ "--icon-size": "18px" }}
          />
          <span>全选</span>
        </div>
        <div className={styles["submit-content"]}>
          {isEdit ? (
            <div className={styles["submit-btn"]} onClick={handleDeleteChecked}>
              删除
            </div>
          ) : (
            <>
              <div>
                合计：
                <span className={styles["submit-amount"]}>
                  ￥{totalAmount.toFixed(2)}
                </span>
              </div>
              <div className={styles["submit-btn"]} onClick={submit}>
                去结算({checkedItemCount})
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
