import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Toast } from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form/form";
import cn from "classnames"

import Code from "@/components/Code"
import type { LoginForm } from "@/api/types";
import styles from "./index.module.scss";

interface FormErrorInfo {
  errorFields: Array<{
    errors: string[];
  }>;
}

// 表单验证规则
const rules = {
  phone: [{ required: true, message: "手机号不能为空" }],
  password: [{ required: true, message: "密码不能为空" }],
  passwordConfirm: [
    { required: true, message: "请再次输入密码" },
    ({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }
        if (value !== getFieldValue("password")) {
          return Promise.reject(new Error("两次输入的密码不一致"));
        }
        return Promise.resolve();
      },
    }),
  ],
  code: [{ required: true, message: "验证码不能为空" }],
};

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef<FormInstance | null>(null);

  // 跳转页面
  const toPages = (url: string) => {
    navigate(url);
  };

  // 数据验证失败触发（代替表单组件原本错误反馈提示）
  const onFinishFailed = (errorInfo: FormErrorInfo) => {
    Toast.show({ content: errorInfo.errorFields[0].errors[0] });
  };

  // 提交
  const handleSubmit = (values: LoginForm) => {
    console.log(values);
  };

  return (
    <div className={styles["page"]}>
      <div className={styles["title"]}>注册账号</div>

      <Form
        ref={formRef}
        layout="horizontal"
        className={styles["form"]}
        hasFeedback={false}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="userid"
          rules={rules.phone}
          className={styles["form-item"]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={rules.password}
          className={styles["form-item"]}
        >
          <Input placeholder="请输入密码" type="password" />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          rules={rules.passwordConfirm}
          className={styles["form-item"]}
        >
          <Input placeholder="请再次输入密码" type="password" />
        </Form.Item>
        <Form.Item
          name="code"
          rules={rules.code}
          className={styles["form-item"]}
          extra={<Code type="text" />}
        >
          <Input placeholder="请输入验证码" />
        </Form.Item>
      </Form>

      <Button
        block
        color="primary"
        className={styles["btn"]}
        onClick={() => formRef.current?.submit()}
      >
        注册
      </Button>

      <div className={cn(styles["links"], styles["links-center"])}>
        <div onClick={() => toPages("/login")}>已有账号？立即登录</div>
      </div>
    </div>
  );
};

export default Register;
