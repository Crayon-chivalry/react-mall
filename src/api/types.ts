// 接口结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 基本分页
export interface Pagination {
  page: number
  pageSize: number
}


// 登录
export interface LoginParams {
  phone: number
  password: string
  code: number
}

// 注册
export interface RegisterParams {
  phone: number
  password: string
  nickname: string
}

// 轮播图
export interface BannerItem {
  id: number
  imageUrl: string
  linkUrl: string
  title: string
}

// 分类
export interface CategoriesItem {
  id: number
  icon: string
  name: string
  parentId: number | null
  children: CategoriesItem[]
}

// 商品 暂
export interface GoodsItem {
  id: number
  cover: string
  name: string
  price: number
}

// 地址
export interface AddressItem {
  receiverName: string
  receiverPhone: number
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode: string
  isDefault: boolean
  addressTag?: string
}