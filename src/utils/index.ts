import type { SpecsItem } from "@/api/types";

// 手机号脱敏
export const maskPhone = (phone: string | number | null | undefined) => {
  if (phone === null || phone === undefined || phone === '') {
    return '--';
  }

  const value = String(phone).replace(/\D/g, '');

  if (value.length !== 11) {
    return String(phone);
  }

  return `${value.slice(0, 3)}****${value.slice(7)}`;
};

// 格式化商品规格展示文案
export const formatSpecsLabel = (specs: SpecsItem[]) => {
  return (
    specs
      .filter((spec) => spec.name && spec.value)
      .map((spec) => `${spec.name}：${spec.value}`)
      .join(" / ") || "默认"
  );
};
