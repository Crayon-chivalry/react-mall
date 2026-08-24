import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchOutline } from "antd-mobile-icons";

import { shopApi } from "@/api/shopApi";
import type { ProductItem } from "@/api/types";
import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar";
import ProductCard from "@/components/ProductCard";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [list, setList] = useState<ProductItem[]>([]);

  // 获取商品列表
  const getProductList = async () => {
    const { data: res } = await shopApi.goodsList({
      page: 1,
      pageSize: 100,
      keyword: keyword,
    });
    setList(res.data.list);
    console.log(res);
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <>
      <AppNavBar title="搜索" />

      <div className={styles["header"]}>
        <div className={styles["search"]} 
        // onClick={onSearchClick}
        >
          <SearchOutline />
          <div>请输入内容</div>
        </div>
      </div>

      <ProductCard list={list} />
    </>
  );
};

export default ProductList;
