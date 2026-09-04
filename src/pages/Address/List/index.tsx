import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Checkbox, Button, Dialog, ErrorBlock, Toast } from "antd-mobile";
import { EditSOutline, DeleteOutline } from "antd-mobile-icons";

import AppNavBar from "@/components/AppNavBar";
import type { AddressItem } from "@/api/types";
import { addressApi } from "@/api/addressApi";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";

const Address = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const location = useLocation();
  const formPath = (location.state?.from as string) || "/";
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  // 添加/编辑 点击
  const handleEditClick = (e: React.MouseEvent, id?: number) => {
    e.stopPropagation();
    if (id) {
      navigate("/address/form?id=" + id);
    } else {
      navigate("/address/form");
    }
  };

  // 返回
  const handleBack = (item?: AddressItem) => {
    navigate(formPath, {
      state: { selectedAddress: item },
      replace: true, // 清掉地址列表页，释放栈内存
    });
  };

  // 选择地址
  const handleSelect = (item: AddressItem) => {
    if (mode === "select") {
      setSelectedAddressId(item.id);
      handleBack(item);
    }
  };

  // 设置默认地址
  const checkChange = async (val: boolean, id: number) => {
    if (!val) return;
    const { data: res } = await addressApi.setDefault(id);
    Toast.show({ icon: "success", content: res.message });
    setTimeout(() => {
      getAddress();
    }, 600);
  };

  // 删除
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    Dialog.confirm({
      content: "确定要删除吗？",
      onConfirm: async () => {
        const { data: res } = await addressApi.delete(id);
        Toast.show({ icon: "success", content: res.message });
        getAddress();
      },
    });
  };

  // 获取地址列表
  const getAddress = async () => {
    const { data: res } = await addressApi.list();
    setAddressList(res.data);
    setSelectedAddressId(
      res.data.find((item: AddressItem) => item.isDefault)?.id ?? null,
    );
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      <AppNavBar title="地址管理" onBack={handleBack} />

      <div className={styles["address-list"]}>
        {addressList.map((item) => (
          <div
            className={`${styles["address-item"]} ${
              selectedAddressId === item.id
                ? styles["address-item-selected"]
                : ""
            }`}
            key={item.id}
            onClick={() => handleSelect(item)}
          >
            <div className={styles["address-header"]}>
              <div>收货人：{item.receiverName}</div>
              <div>{item.receiverPhone}</div>
            </div>
            <div className={styles["address-details"]}>
              {item.province + item.city + item.district + item.detailAddress}
            </div>
            <div className={styles["address-footer"]}>
              <Checkbox
                className={styles["checkbox"]}
                checked={item.isDefault}
                onChange={(val) => checkChange(val, item.id)}
                onClick={(e) => e.stopPropagation()}
              >
                默认地址
              </Checkbox>
              <div className={styles["btn-wrap"]}>
                <div
                  className={styles["btn"]}
                  onClick={(e) => handleEditClick(e, item.id)}
                >
                  <EditSOutline />
                  <span>编辑</span>
                </div>
                <div
                  className={styles["btn"]}
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  <DeleteOutline />
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {addressList.length === 0 && <ErrorBlock status="empty" />}
      </div>

      <div className={styles["footer-fixed"]}>
        <Button
          block
          color="primary"
          shape="rounded"
          onClick={(e) => handleEditClick(e)}
        >
          添加地址
        </Button>
      </div>
    </>
  );
};

export default Address;
