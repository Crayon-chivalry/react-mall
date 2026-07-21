// 登录 / 注册
export interface LoginForm {
  phone: number
  password: string
  code?: number
}

// 商品 暂
export interface GoodsItem {
  id: number
  cover: string
  name: string
  price: number
}