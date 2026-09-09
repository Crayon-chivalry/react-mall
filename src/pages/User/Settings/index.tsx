import { RightOutline } from "antd-mobile-icons";
import {
  Button,
  Space,
  Toast,
  Dialog,
  Input,
  type ImageUploadItem,
} from "antd-mobile";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.scss";
import { userApi } from "@/api/userApi";
import type { UpdateProfileParams } from "@/api/types";
import useUserStore from "@/store/userStore";
import AppNavBar from "@/components/AppNavBar";
import ImageUploader from "@/components/ImageUploader";
import Code from "@/components/Code";

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();

  // 上传头像
  const uploadSuccess = (items: ImageUploadItem[]) => {
    const avatar = items[items.length - 1]?.url;
    if (avatar) {
      updateProfile({ avatar });
    }
  };

  // 修改资料
  const updateProfile = async (params: UpdateProfileParams) => {
    const { data: res } = await userApi.updateProfile(params);
    updateUser(params);
    Toast.show({
      content: res.message,
      icon: "success",
    });
  };

  // 对话框，修改手机号、昵称
  const confirmDialog = (
    type: "nickname" | "phone",
    value?: string | number,
  ) => {
    let currentValue = String(value ?? "");

    return Dialog.confirm({
      title: "修改",
      content: (
        <div className={styles["dialog-content"]}>
          <div className={styles["dialog-input"]}>
            <Input
              placeholder="请输入内容"
              type="text"
              defaultValue={currentValue}
              onChange={(val) => {
                currentValue = String(val);
              }}
            />
          </div>
          {type === "phone" && (
            <div className={styles["dialog-input"]}>
              <div style={{flex: 1}}>
                <Input placeholder="请输入验证码(随便填)" type="text" />
              </div>
              <Code type="text" />
            </div>
          )}
        </div>
      ),
      onConfirm: () => {
        if (type === "nickname") {
          updateProfile({ nickname: currentValue });
        }

        if (type === "phone") {
          updateProfile({ phone: currentValue });
        }
      },
    });
  };

  return (
    <>
      <AppNavBar title="设置" />

      <div className={styles["container"]}>
        <div className={styles["card"]}>
          <div className={styles["card-cell"]}>
            <div>头像</div>
            <div className={styles["cover"]}>
              <img
                src={user?.avatar || "/src/assets/images/tx.png"}
                className={styles["avatar"]}
              />
              <div className={styles["cover-load"]}>
                <ImageUploader
                  maxCount={0}
                  replaceOnPreview
                  preview={false}
                  onChange={uploadSuccess}
                />
              </div>
            </div>
          </div>
          <div className={styles["card-cell"]}>
            <div>昵称</div>
            <Space
              onClick={() => confirmDialog("nickname", user?.nickname ?? "")}
            >
              <div className={styles["card-label"]}>{user?.nickname}</div>
              <RightOutline />
            </Space>
          </div>
          <div className={styles["card-cell"]}>
            <div>更换手机号</div>
            <Space onClick={() => confirmDialog("phone", user?.phone ?? "")}>
              <div className={styles["card-label"]}>{user?.phone}</div>
              <RightOutline />
            </Space>
          </div>
          <div
            className={styles["card-cell"]}
            onClick={() => navigate("/auth/update-password")}
          >
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

        <Button color="primary" className={styles["logout-btn"]}>
          退出登录
        </Button>
      </div>
    </>
  );
};

export default Settings;
