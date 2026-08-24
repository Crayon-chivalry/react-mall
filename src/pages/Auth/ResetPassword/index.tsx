import { useRef } from "react";
import { Form, Input, Button } from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form/form";

import Code from '@/components/Code'
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";

// 表单验证规则
const rules = {
  phone: [{ required: true, message: "手机号不能为空" }],
  code: [{ required: true, message: "验证码不能为空" }],
  password: [{ required: true, message: "新密码不能为空" }],
}

const Register = () => {
  const formRef = useRef<FormInstance | null>(null);

  return (
    <>
      <AppNavBar title="找回密码" />

      <div className={styles["re-password"]}>
        <Form ref={formRef} className={styles["re-form"]}>
          <Form.Item
            name="userid"
            label="手机号"
            rules={rules.phone}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="code"
            label="验证码"
            rules={rules.code}
            extra={<Code type="text" />}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item
            name="password"
            label="新密码"
            rules={rules.password}
          >
            <Input placeholder="请输入新密码" type="password" />
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

export default Register;
