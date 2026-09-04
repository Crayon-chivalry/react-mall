import { RightOutline } from 'antd-mobile-icons'
import { Button, Space } from 'antd-mobile'
import { useNavigate } from 'react-router-dom';

import styles from "./index.module.scss";
import useUserStore from "@/store/userStore";
import AppNavBar from "@/components/AppNavBar";

const Settings = () => {
  const navigate = useNavigate()
  const { user } = useUserStore();

  return (
    <>
      <AppNavBar title="设置" />

      <div className={styles["container"]}>
        <div className={styles["card"]}>
          <div className={styles["card-cell"]}>
            <div>头像</div>
            <img src="/src/assets/images/tx.png" className={styles["avatar"]} />
          </div>
          <div className={styles["card-cell"]}>
            <div>昵称</div>
            <div className={styles["card-label"]}>{user?.nickname}</div>
          </div>
          <div className={styles["card-cell"]}>
            <div>更换手机号</div>
            <Space>
              <div className={styles["card-label"]}>{user?.phone}</div>
              <RightOutline />
            </Space>
          </div>
          <div className={styles["card-cell"]} onClick={() => navigate("/auth/update-password")}>
            <div>修改密码</div>
            <RightOutline />
          </div>
        </div>

        <div className={styles["card"]}>
          <div className={styles["card-cell"]}>
            <div>关于我们</div>
            <RightOutline />
          </div>
          <div className={styles["card-cell"]}>
            <div>用户协议</div>
            <RightOutline />
          </div>
          <div className={styles["card-cell"]}>
            <div>隐私协议</div>
            <RightOutline />
          </div>
        </div>

        <Button color='primary' className={styles["logout-btn"]}>
          退出登录
        </Button>
      </div>
    </>
  )
}

export default Settings