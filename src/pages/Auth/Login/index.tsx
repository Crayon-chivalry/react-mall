import { useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Toast, Dialog, Checkbox } from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form/form";

import Code from "@/components/Code"
import type { LoginParams } from "@/api/types"
import { userApi } from "@/api/userApi";
import useUserStore from "@/store/userStore";
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
  code: [{ required: true, message: "验证码不能为空" }],
}

const Login = () => {
  const navigate = useNavigate();
  const formRef = useRef<FormInstance | null>(null);
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState(true); // 是否同意用户协议
  const { signIn } = useUserStore()

  // 跳转页面
  const toPages = (url: string) => {
    navigate(url);
  };

  // 展示用户手册、隐私政策对话框
  const onShowagreement = (e: MouseEvent<HTMLSpanElement>, type: 1 | 2) => {
    e.preventDefault(); // 阻止默认行为
    Dialog.alert({
      content: type === 1 ? "用户手册" : "隐私政策",
    });
  };

  // 数据验证失败触发（代替表单组件原本错误反馈提示）
  const onFinishFailed = (errorInfo: FormErrorInfo) => {
    Toast.show({ content: errorInfo.errorFields[0].errors[0] });
  };

  // 提交
  const handleSubmit = async (values: LoginParams) => {
    const { data: res } = await userApi.login(values)
    const loginData = res.data
    Toast.show({ content: res.message });
    signIn(loginData.accessToken, loginData.user)
    // 暂，后续修改成哪个页面跳转来就跳回原先页面
    navigate("/user")
  };

  return (
    <div className={styles["page"]}>
      <div className={styles["title"]}>欢迎来到商城</div>

      <div className={styles["tabs"]}>
        <div
          className={`${styles["tabs-item"]} ${
            active === 0 && styles["tabs-active"]
          }`}
          onClick={() => setActive(0)}
        >
          密码登录
        </div>
        <div className={styles["tabs-item"]}>|</div>
        <div
          className={`${styles["tabs-item"]} ${
            active === 1 && styles["tabs-active"]
          }`}
          onClick={() => setActive(1)}
        >
          验证码登录
        </div>
      </div>

      <Form
        ref={formRef}
        layout="horizontal"
        className={styles["form"]}
        hasFeedback={false}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="phone"
          rules={rules.phone}
          className={styles["form-item"]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        {active == 0 ? (
          <Form.Item
            name="password"
            rules={rules.password}
            className={styles["form-item"]}
          >
            <Input placeholder="请输入登录密码" type="password" />
          </Form.Item>
        ) : (
          <Form.Item
            name="code"
            rules={rules.code}
            className={styles["form-item"]}
            extra={<Code type="text" />}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>
        )}
      </Form>

      <div className={styles["links"]}>
        <div onClick={() => toPages("/auth/register")}>还没有账号？去注册</div>
        <div onClick={() => toPages("/auth/reset-password")}>忘记密码</div>
      </div>

      <Button
        block
        color="primary"
        className={styles["btn"]}
        onClick={() => formRef.current?.submit()}
      >
        登录
      </Button>

      <div className={styles["agreement"]}>
        <Checkbox
          className={styles["checkbox"]}
          checked={checked}
          onChange={(val) => setChecked(val)}
        >
          阅读并同意
          <span
            className={styles["link-text"]}
            onClick={(e) => onShowagreement(e, 1)}
          >
            用户手册
          </span>
          和
          <span
            className={styles["link-text"]}
            onClick={(e) => onShowagreement(e, 2)}
          >
            隐私政策
          </span>
        </Checkbox>
      </div>
    </div>
  );
};

export default Login;