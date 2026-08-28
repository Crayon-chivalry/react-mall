import { useNavigate } from "react-router-dom";
import { Checkbox, Button, Dialog, ErrorBlock, Toast } from "antd-mobile";
import { EditSOutline, DeleteOutline } from "antd-mobile-icons";

import AppNavBar from "@/components/AppNavBar";
import type { AddressItem } from "@/api/types";
import { addressApi } from "@/api/addressApi";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";

const Address = () => {
  const navigate = useNavigate();
  const [addressList, setAddressList] = useState<AddressItem[]>([]);

  // 添加/编辑 点击
  const handleEditClick = (id?: number) => {
    if (id) {
      navigate("/address/form?id=" + id);
    } else {
      navigate("/address/form");
    }
  };
  
  const checkChange = async (val: boolean, id: number) => {
    if(!val) return
    const { data: res } = await addressApi.setDefault(id)
    Toast.show({ icon: 'success', content: res.message })
    setTimeout(() => {
      getAddress()
    }, 600)
  }

  // 删除
  const handleDelete = (id: number) => {
    Dialog.confirm({
      content: "确定要删除吗？",
      onConfirm: async () => {
        const { data: res } = await addressApi.delete(id)
        Toast.show({ icon: 'success', content: res.message })
        getAddress()
      },
    });
  };

  // 获取地址列表
  const getAddress = async () => {
    const { data: res } = await addressApi.list();
    setAddressList(res.data);
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      <AppNavBar title="地址管理" />

      <div className={styles["address-list"]}>
        {addressList.map((item) => (
          <div className={styles["address-item"]} key={item.id}>
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
              >
                默认地址
              </Checkbox>
              <div className={styles["btn-wrap"]}>
                <div
                  className={styles["btn"]}
                  onClick={() => handleEditClick(item.id)}
                >
                  <EditSOutline />
                  <span>编辑</span>
                </div>
                <div
                  className={styles["btn"]}
                  onClick={() => handleDelete(item.id)}
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
          onClick={() => handleEditClick()}
        >
          添加地址
        </Button>
      </div>
    </>
  );
};

export default Address;
