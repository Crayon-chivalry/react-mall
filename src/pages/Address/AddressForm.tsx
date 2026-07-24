import { useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  CascadePicker,
  TextArea,
  Switch,
} from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form/form";
import type { PickerColumnItem, PickerValue, PickerValueExtend } from "antd-mobile/es/components/picker-view";

import AppNavBar from "@/components/AppNavBar";
import type { AddressItem } from "@/api/types";
import styles from "./index.module.scss";
import areas from "@/assets/json/areas.json";

const rules = [
  [{ required: true, message: "收货人不能为空" }],
  [{ required: true, message: "手机号不能为空" }],
  [{ required: true, message: "地址不能为空" }],
];

const AddressForm = () => {
  const title = "添加地址";
  const formRef = useRef<FormInstance>(null);
  const [formArea, setFormArea] = useState("");

  // 格式化地址
  const formatAddress = (val: Array<PickerColumnItem | null>) => {
    return val
      .filter((item): item is PickerColumnItem => Boolean(item))
      .map((item) => item.label)
      .join("");
  };

  // 确认选择地址
  const confirmAreas = (val: PickerValue[], extend: PickerValueExtend) => {
    setFormArea(formatAddress(extend.items ?? []));
  };

  // 提交
  const handleSubmit = (values: AddressItem) => {
    console.log(values);
    console.log(formArea);
  };

  return (
    <>
      <AppNavBar title={title} />

      <div className={styles["form-wrap"]}>
        <Form ref={formRef} className={styles["form"]} onFinish={handleSubmit}>
          <Form.Item name="name" label="收货人" rules={rules[0]}>
            <Input placeholder="请输入收货人" />
          </Form.Item>
          <Form.Item name="tel" label="手机号" rules={rules[1]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="areaCode"
            label="地址"
            rules={rules[2]}
            trigger="onConfirm"
            onClick={(_e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <CascadePicker title="地址" options={areas} onConfirm={confirmAreas}>
              {(value) =>
                value.length > 0 ? formatAddress(value) : "请选择地址"
              }
            </CascadePicker>
          </Form.Item>
          <Form.Item name="detailsAddress" label="详细地址">
            <TextArea
              placeholder="请输入详细地址"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item name="default" label="默认地址" valuePropName="checked">
            <Switch />
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

export default AddressForm;
