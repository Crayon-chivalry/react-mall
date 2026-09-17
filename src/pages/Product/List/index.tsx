import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InfiniteScroll } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";

import { shopApi } from "@/api/shopApi";
import type { ProductItem } from "@/api/types";
import styles from "./index.module.scss";
import usePagination from "@/hooks/usePagination";
import AppNavBar from "@/components/AppNavBar";
import ProductCard from "@/components/ProductCard";

const ProductList = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const categoryId = searchParams.get("categoryId");

  // 获取商品列表
  const { list, hasMore, refresh, loadMore } = usePagination<ProductItem>({
    fetcher: async (page, pageSize) => {
      const { data: res } = await shopApi.goodsList({
        page,
        pageSize,
        keyword: keyword,
        ...(categoryId? { categoryId: categoryId } : {})
      });
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      };
    },
    pageSize: 10,
    autoLoad: false,
  });

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <>
      <AppNavBar title="搜索" />

      <div className={styles["header"]}>
        <div
          className={styles["search"]}
          onClick={() => navigate(-1)}
        >
          <SearchOutline />
          <div>请输入内容</div>
        </div>
      </div>

      <ProductCard list={list} />
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );
};

export default ProductList;
