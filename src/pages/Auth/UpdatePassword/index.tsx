import { useRef } from "react";
import { Form, Input, Button, Toast } from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form/form";

import styles from "./index.module.scss";
import { userApi } from "@/api/userApi";
import type { UpdatePasswordParams } from "@/api/types"
import AppNavBar from "@/components/AppNavBar";

// 表单验证规则
const rules = {
  phone: [{ required: true, message: "手机号不能为空" }],
  oldPassword: [{ required: true, message: "旧密码不能为空" }],
  newPassword: [{ required: true, message: "新密码不能为空" }],
  confirmPassword: [
    { required: true, message: "请再次输入密码" },
    ({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
      validator(_: any, value: string) {
        if (!value) {
          return Promise.resolve();
        }
        if (value !== getFieldValue("newPassword")) {
          return Promise.reject(new Error("两次输入的密码不一致"));
        }
        return Promise.resolve();
      },
    }),
  ]
}

const UpdatePassword = () => {
  const formRef = useRef<FormInstance | null>(null);

  // 提交
  const handleSubmit = async (values: UpdatePasswordParams) => {
    const { data: res } = await userApi.updatePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    })
    Toast.show({ content: res.message });
    formRef.current?.resetFields()
  }

  return (
    <>
      <AppNavBar title="修改密码" />

      <div className={styles["re-password"]}>
        <Form ref={formRef} className={styles["re-form"]} onFinish={handleSubmit}>
          <Form.Item
            name="oldPassword"
            label="旧密码"
            rules={rules.oldPassword}
          >
            <Input placeholder="请输入旧密码" type="password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={rules.newPassword}
          >
            <Input placeholder="请输入新密码" type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={rules.confirmPassword}
          >
            <Input placeholder="请再次输入密码" type="password" />
          </Form.Item>
        </Form>

        <Button
          block
          color="primary"
          className={styles["btn"]}
          onClick={() => formRef.current?.submit()}
        >
          确认
        </Button>
      </div>
    </>
  );
};

export default UpdatePassword;
