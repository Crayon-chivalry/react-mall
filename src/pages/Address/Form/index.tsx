import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  CascadePicker,
  TextArea,
  Switch,
  Toast
} from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form/form";
import type {
  PickerColumnItem,
  PickerValue,
  PickerValueExtend,
} from "antd-mobile/es/components/picker-view";

import AppNavBar from "@/components/AppNavBar";
import type { AddressItem } from "@/api/types";
import { addressApi } from "@/api/addressApi";
import styles from "./index.module.scss";
import areas from "@/assets/json/areas.json";

const rules = {
  name: [{ required: true, message: "收货人不能为空" }],
  phone: [{ required: true, message: "手机号不能为空" }],
  code: [{ required: true, message: "地址不能为空" }],
}

const AddressForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("id");
  const title = addressId ? "编辑地址" : "添加地址";
  const formRef = useRef<FormInstance>(null);
  const [formAreaItems, setFormAreaItems] = useState<Array<PickerColumnItem | null>>([]);
  const [selectedAddressValue, setSelectedAddressValue] = useState<PickerValue[]>([]);

  // 格式化地址
  const formatAddress = (val: Array<PickerColumnItem | null>) => {
    return val
      .filter((item): item is PickerColumnItem => Boolean(item))
      .map((item) => item.label)
      .join("");
  };

  // 确认选择地址
  const confirmAreas = (val: PickerValue[], extend: PickerValueExtend) => {
    setFormAreaItems(extend.items ?? []);
    setSelectedAddressValue(val);
  };

  // 根据省市区名称，从地区数据中找到对应的级联选项，供编辑回填时使用
  const getAddressItems = (
    province?: string,
    city?: string,
    district?: string,
  ) => {
    const provinceItem = areas.find((item) => item.label === province);
    const cityItem = provinceItem?.children?.find((item) => item.label === city);
    const districtItem = cityItem?.children?.find((item) => item.label === district);

    return [provinceItem, cityItem, districtItem].filter(Boolean) as PickerColumnItem[];
  };

  // 把 antd 的选择器项 label 统一转成字符串
  const getPickerLabelText = (item: PickerColumnItem | null | undefined) => {
    if (!item?.label) return "";
    return typeof item.label === "string" ? item.label : "";
  };

  // 提交
  const handleSubmit = async (values: AddressItem) => {
    const postalCode = Array.isArray(values.postalCode)
      ? values.postalCode[values.postalCode.length - 1]
      : values.postalCode;
    const params = {
      ...values,
      postalCode,
      province: getPickerLabelText(formAreaItems[0]),
      city: getPickerLabelText(formAreaItems[1]),
      district: getPickerLabelText(formAreaItems[2]),
    }
    const { data: res } = addressId ? await addressApi.update(Number(addressId), params)
    : await addressApi.add(params)
    Toast.show({ icon: 'success', content: res.message })
    setTimeout(() => {
      navigate(-1)
    }, 600)
  };

  // 获取地址详情
  const getAddress = async () => {
    const { data: res } = await addressApi.details(Number(addressId))
    const addressData = res.data as AddressItem & {
      province?: string;
      city?: string;
      district?: string;
    };

    const addressItems = getAddressItems(addressData.province, addressData.city, addressData.district);
    setFormAreaItems(addressItems);
    setSelectedAddressValue(
      addressItems.map((item) => item.value ?? "") as PickerValue[],
    );

    formRef.current?.setFieldsValue({
      receiverName: addressData.receiverName,
      receiverPhone: addressData.receiverPhone,
      detailAddress: addressData.detailAddress,
      isDefault: addressData.isDefault,
      postalCode: addressItems.map((item) => item.value ?? "") as PickerValue[],
    });
  }

  useEffect(() => {
    if(addressId) getAddress()
  }, [addressId])

  return (
    <>
      <AppNavBar title={title} />

      <div className={styles["form-wrap"]}>
        <Form ref={formRef} className={styles["form"]} onFinish={handleSubmit}>
          <Form.Item name="receiverName" label="收货人" rules={rules.name}>
            <Input placeholder="请输入收货人" />
          </Form.Item>
          <Form.Item name="receiverPhone" label="手机号" rules={rules.phone}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="postalCode"
            label="地址"
            rules={rules.code}
            trigger="onConfirm"
            onClick={(_e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
          >
            <CascadePicker
              title="地址"
              options={areas}
              value={selectedAddressValue}
              onConfirm={confirmAreas}
            >
              {(value) =>
                formAreaItems.length > 0 ? formatAddress(formAreaItems) : value.length > 0 ? "请选择地址" : "请选择地址"
              }
            </CascadePicker>
          </Form.Item>
          <Form.Item name="detailAddress" label="详细地址">
            <TextArea
              placeholder="请输入详细地址"
              style={{ "--font-size": "14px" }}
            />
          </Form.Item>
          <Form.Item name="isDefault" label="默认地址" valuePropName="checked">
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
