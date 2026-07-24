import { useNavigate } from "react-router-dom";
import { Checkbox, Button, Dialog } from "antd-mobile";
import { EditSOutline, DeleteOutline } from "antd-mobile-icons";

import AppNavBar from "@/components/AppNavBar";
import { addressApi } from "@/api/addressApi";
import styles from "./index.module.scss";
import { useEffect } from "react";

const Address = () => {
  const navigate = useNavigate()

  // 添加/编辑 点击
  const handleEditClick = (id?: number) => {
    if(id) {
      navigate("/Address-form?id=" + id)
    } else {
      navigate("/Address-form")
    }
  }

  // 删除
  const handleDelete = (id: number) => {
    Dialog.confirm({
      content: '确定要删除吗？',
      onConfirm: () => {
        console.log('删除')
      }
    })
  }

  // 获取地址列表
  const getAddress = async () => {
    const { data: res } = await addressApi.list()
    console.log(res)
  }

  useEffect(() => {
    getAddress()
  }, [])

  return (
    <>
      <AppNavBar title="地址管理" />

      <div className={styles["address-list"]}>
        <div className={styles["address-item"]}>
          <div className={styles["address-header"]}>
            <div>收货人：小黑子</div>
            <div>1521000000</div>
          </div>
          <div className={styles["address-details"]}>
            四川省成都市武侯区置信南街xxxx地址
          </div>
          <div className={styles["address-footer"]}>
            <Checkbox className={styles["checkbox"]} defaultChecked>
              默认地址
            </Checkbox>
            <div className={styles["btn-wrap"]}>
              <div className={styles["btn"]} onClick={() => handleEditClick(1)}>
                <EditSOutline />
                <span>编辑</span>
              </div>
              <div className={styles["btn"]} onClick={() => handleDelete(1)}>
                <DeleteOutline />
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["footer-fixed"]}>
        <Button block color="primary" shape="rounded" onClick={() => handleEditClick()}>
          添加地址
        </Button>
      </div>
    </>
  );
};

export default Address;