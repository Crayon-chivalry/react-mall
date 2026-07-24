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
