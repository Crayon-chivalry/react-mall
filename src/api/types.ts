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

// 金刚区
export interface EntriesItem {
  id: number
  title: string
  iconUrl: string
  linkUrl: string
  sort: number
  isEnabled: boolean
}

// 分类
export interface CategoriesItem {
  id: number
  icon: string
  name: string
  parentId: number | null
  children: CategoriesItem[]
}

// 商品
export interface SpecsItem {
  name: string
  value: string
}

export interface SkuItem {
  title: string
  specs: SpecsItem[]
  price: string
  stock: number
  cover: string
  isDefault: boolean
}

export interface ProductItem {
  id: number
  name: string
  price: string
  stock: number
  sales: number
  categoryId: number
  cover: string
  images: string[]
  description: string
  detailContent: string
  isOnSale: boolean
  skus: SkuItem[]
  category: CategoriesItem
  specType: "single" | "multi"
}

export interface ProductListParams extends Pagination {
  keyword?: string | null
}

// 地址
export interface AddressItem {
  id: number
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