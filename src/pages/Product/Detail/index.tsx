import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DOMPurify from 'dompurify';
import { Swiper, ImageViewer, Space, Toast } from "antd-mobile";

import { shopApi } from "@/api/shopApi";
import type { ProductItem, SkuItem } from "@/api/types";
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";
import ActionBar from "../components/ActionBar"
import SkuPopup, { type SkuPopupMode } from "../components/SkuPopup"
import useCartStore from "@/store/cartStore";

const Product = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const goodsId = searchParams.get("id");
  const [pageData, setPageData] = useState<ProductItem | null>(null);
  const [visible, setVisible] = useState<boolean>(false)
  const imageViewerRef = useRef<{ swipeTo: (index: number) => void } | null>(null)
  // 规格弹窗
  const [skuVisible, setSkuVisible] = useState<boolean>(false);
  const [skuMode, setSkuMode] = useState<SkuPopupMode>("cart");
  const addCartItem = useCartStore((state) => state.addCartItem);

  const setCheckoutItems = useCartStore((state) => state.setCheckoutItems);

  // 打开规格弹窗（cart=加入购物车 buy=立即购买）
  const openSkuPopup = (mode: SkuPopupMode) => {
    setSkuMode(mode);
    setSkuVisible(true);
  };

  // 规格弹窗确认回调
  const handleSkuConfirm = (sku: SkuItem, quantity: number) => {
    if (!pageData) {
      Toast.show({
        content: "商品信息还没加载完，请稍后再试",
        icon: "fail",
      });
      return;
    }
    if (skuMode === "cart") {
      if (pageData) {
        addCartItem(pageData, sku, quantity);
        Toast.show({
          content: "加入购物车成功",
        });
      }
    } else {
      setCheckoutItems([{
        product: pageData,
        sku,
        quantity,
        checked: true
      }])
      navigate("/order/confirm")
    }
    setSkuVisible(false);
  };
  
  // 轮播图图片点击显示查看器
  const swiperItemClick = (index: number) => {
    imageViewerRef.current?.swipeTo(index)
    setVisible(true)
  }

  function ProductDetail({ description }: { description: string }) {
    // 1. 清洗 HTML：过滤掉 script、onerror 等恶意代码
    const cleanHtml = DOMPurify.sanitize(description, {
      USE_PROFILES: { html: true },
    });
    // 2. 渲染
    return (
      <div 
        className="product-desc" 
        dangerouslySetInnerHTML={{ __html: cleanHtml }} 
      />
    );
  }

  const getGoods = async () => {
    if (!goodsId) return;
    const { data: res } = await shopApi.goods(Number(goodsId));
    setPageData(res.data);
  };

  useEffect(() => {
    getGoods();
  }, []);

  return (
    <>
      <AppNavBar title="详情" />

      {pageData && (
        <>
          {/* 商品主图 */}
          <Swiper
            className={styles.swiper}
            autoplay
            loop
            indicatorProps={{ color: "white" }}
            autoplayInterval={5000}
          >
            {pageData.images.map((item, index) => (
              <Swiper.Item key={index}>
                <img src={item} className={styles["swiper-image"]} onClick={() => swiperItemClick(index)} />
              </Swiper.Item>
            ))}
          </Swiper>
          {/* 图片查看器 */}
          <ImageViewer.Multi
            ref={imageViewerRef}
            images={pageData.images}
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
          />
          {/* 商品基本信息 */}
          <div className={styles["base-info"]}>
            <Space block justify="between" align="center">
              <div className={styles["price"]}>￥<span>{ pageData.price }</span></div>
              <div className={styles["sales"]}>已售{ pageData.sales }</div>
            </Space>
            <div className={styles["name"]}>{ pageData.name } { pageData.description }</div>
          </div>
          {/* 详情 */}
          <div className={styles["details"]}>
            <div className={styles["details-title"]}>商品详情</div>
            {ProductDetail({description: pageData.detailContent})}
          </div>
          {/* 动作栏 */}
          <ActionBar
            onAddCart={() => openSkuPopup("cart")}
            onBuy={() => openSkuPopup("buy")}
          />
          {/* 规格选择弹窗 */}
          <SkuPopup
            visible={skuVisible}
            goods={pageData}
            mode={skuMode}
            onClose={() => setSkuVisible(false)}
            onConfirm={handleSkuConfirm}
          />
        </>
      )}
    </>
  );
};

export default Product;
