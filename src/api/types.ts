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

// 密码
export interface UpdatePasswordParams {
  oldPassword: string
  newPassword: string
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

/**
 * 商品相关
 */
export interface SpecsItem {
  name: string
  value: string
}

export interface SkuItem {
  id: number
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

/**
 * 订单
 */

// 订单创建提交的 items
export interface OrderCreateProductItem {
  productId: number
  skuId: number
  quantity: number
}

export interface OrderCreateParams {
  shippingAddressId: number
  cartItemIds?: number[]
  items?: OrderCreateProductItem[]
  remark: string
}

// 订单列表的商品数据
export interface OrderProductItem {
  id: number
  price: string
  productCover: string
  productName: string
  quantity: number
  skuTitle: string
  product: ProductItem
  sku: SkuItem[]
  skuSpecs: SpecsItem[]
}

export type OrderStatus = "pending" | "paid" | "shipped" | "completed"

export interface OrderItem {
  id: number
  createdAt: string
  orderNo: string
  totalAmount: string
  status: OrderStatus
  remark: string
  receiverName: string
  receiverPhone: number
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode: string
  items: OrderProductItem[]
  paymentType: string
  paidAt: string
}

export interface OrderListParams extends Pagination {
  status?: OrderStatus
}