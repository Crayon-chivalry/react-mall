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

// 格式化时间
export const formatLocalTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};
