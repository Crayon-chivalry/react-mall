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

// 订单

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

// {
//     "id": 1,
//     "createdAt": "2026-08-27T08:06:46.210Z",
//     "updatedAt": "2026-08-27T08:06:46.210Z",
//     "orderNo": "O1787818006088373",
//     "totalAmount": "23997.00",
//     "status": "pending",
//     "remark": "发货快点",
//     "paymentType": null,
//     "paymentNo": null,
//     "paidAt": null,
//     "receiverName": "王五",
//     "receiverPhone": "14152526363",
//     "province": "吉林省",
//     "city": "辽源市",
//     "district": "东丰县",
//     "detailAddress": "恒大小区1",
//     "postalCode": "220421",
//     "user": {
//         "id": 30,
//         "createdAt": "2026-08-26T07:24:52.031Z",
//         "updatedAt": "2026-08-26T07:24:52.031Z",
//         "userId": "U1787729092029458",
//         "phone": "14152526363",
//         "account": null,
//         "password": "$2a$10$5Ud2Ao.sOxBY1rsJ7DNoNeSKxL8XF/MfTh29FDMX3mRqng7.Koq3W",
//         "payPassword": null,
//         "nickname": "123",
//         "avatar": null,
//         "role": "customer",
//         "status": 1
//     },
//     "items": [
//         {
//             "id": 1,
//             "createdAt": "2026-08-27T08:06:46.243Z",
//             "updatedAt": "2026-08-27T08:06:46.243Z",
//             "quantity": 1,
//             "price": "7999.00",
//             "productName": "华为P80 pro",
//             "skuTitle": "华为P80 pro",
//             "skuSpecs": [],
//             "productCover": "http://localhost:3000/uploads/images/1785489461415-2e4599dd-3b70-42ba-b2b6-2183a8e28268.jpg",
//             "product": {
//                 "id": 1,
//                 "createdAt": "2026-07-31T09:18:01.693Z",
//                 "updatedAt": "2026-07-31T09:18:01.693Z",
//                 "name": "华为P80 pro",
//                 "price": "7999.00",
//                 "stock": 99,
//                 "sales": 0,
//                 "cover": "http://localhost:3000/uploads/images/1785489461415-2e4599dd-3b70-42ba-b2b6-2183a8e28268.jpg",
//                 "images": [
//                     "http://localhost:3000/uploads/images/1785489461415-2e4599dd-3b70-42ba-b2b6-2183a8e28268.jpg"
//                 ],
//                 "description": "8000千万像素 超清长焦",
//                 "detailContent": "<p>11111111</p>",
//                 "isOnSale": true,
//                 "specType": "single"
//             },
//             "sku": {
//                 "id": 10,
//                 "createdAt": "2026-08-12T08:33:44.039Z",
//                 "updatedAt": "2026-08-12T08:33:44.039Z",
//                 "title": "华为P80 pro",
//                 "specs": [],
//                 "price": "7999.00",
//                 "stock": 99,
//                 "cover": null,
//                 "sort": 0,
//                 "isDefault": true
//             }
//         },
//         {
//             "id": 2,
//             "createdAt": "2026-08-27T08:06:46.264Z",
//             "updatedAt": "2026-08-27T08:06:46.264Z",
//             "quantity": 2,
//             "price": "7999.00",
//             "productName": "OPPOFind X9 Ultra",
//             "skuTitle": "容量",
//             "skuSpecs": [
//                 {
//                     "name": "容量",
//                     "value": "12+256"
//                 }
//             ],
//             "productCover": "http://localhost:3000/uploads/images/1786525029147-d8d40ef7-5964-4bc8-adb6-25631214e349.png",
//             "product": {
//                 "id": 2,
//                 "createdAt": "2026-08-11T09:23:40.329Z",
//                 "updatedAt": "2026-08-19T07:52:45.000Z",
//                 "name": "OPPOFind X9 Ultra",
//                 "price": "7999.00",
//                 "stock": 20,
//                 "sales": 0,
//                 "cover": "http://localhost:3000/uploads/images/1786440204915-5fcdb08a-dc91-40b8-aa28-6ff6056d2e02.png",
//                 "images": [
//                     "http://localhost:3000/uploads/images/1786440204915-5fcdb08a-dc91-40b8-aa28-6ff6056d2e02.png",
//                     "http://localhost:3000/uploads/images/1787125962432-f5afea18-5199-483d-b700-bb378825cbc8.jpg"
//                 ],
//                 "description": "10倍光变天眼长焦 长续航 游戏",
//                 "detailContent": "<p><img src=\"http://localhost:3000/uploads/images/1786440218838-93c3bcdf-751e-44b3-9605-a3be7df2d577.png\" alt=\"\" data-href=\"\" style=\"\"/></p>",
//                 "isOnSale": true,
//                 "specType": "multi"
//             },
//             "sku": {
//                 "id": 14,
//                 "createdAt": "2026-08-19T07:52:45.225Z",
//                 "updatedAt": "2026-08-19T07:52:45.225Z",
//                 "title": "容量",
//                 "specs": [
//                     {
//                         "name": "容量",
//                         "value": "12+256"
//                     }
//                 ],
//                 "price": "7999.00",
//                 "stock": 10,
//                 "cover": "http://localhost:3000/uploads/images/1786525029147-d8d40ef7-5964-4bc8-adb6-25631214e349.png",
//                 "sort": 0,
//                 "isDefault": true
//             }
//         }
//     ]
// }

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

export interface OrderItem {
  id: number
  createdAt: string
  orderNo: string
  totalAmount: string
  status: string
  remark: string
  receiverName: string
  receiverPhone: number
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode: string
  items: OrderProductItem[]
}

export interface OrderListParams extends Pagination {
  status?: "pending" | "paid" | "shipped" | "completed"
}