import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar, ErrorBlock } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";

import styles from "./index.module.scss";
import type { CategoriesItem } from "@/api/types";
import { shopApi } from "@/api/shopApi";

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [children, setChildren] = useState<CategoriesItem[]>([]);

  const onSearchClick = () => {
    navigate("/search");
  };

  // 侧边导航发生变化
  const onChange = (key: string) => {
    setActiveKey(key);
    const currentChildren = categories.find(item => String(item.id) === key)?.children
    if(currentChildren) {
      setChildren(currentChildren)
    }
  };

  // 获取分类
  const getCategories = async () => {
    const { data: res } = await shopApi.categories({ page: 1, pageSize: 100 });
    const list = res.data.list;
    console.log(list);
    setCategories(list);
    if (list.length > 0) {
      setActiveKey(String(list[0].id));
      setChildren(list[0].children);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["search"]} onClick={onSearchClick}>
          <SearchOutline />
          <div>请输入内容</div>
        </div>
      </div>

      <div className={styles["category-row"]}>
        <SideBar activeKey={activeKey} onChange={onChange}>
          {categories.map((item) => (
            <SideBar.Item key={item.id} title={item.name} />
          ))}
        </SideBar>
        <div className={styles["content"]}>
          <div className={styles["grid"]}>
            {children.map((item) => (
              <div className={styles["grid-item"]} key={item.id}>
                <img src={item.icon} className={styles["grid-cover"]} />
                <div className="grid-name">{item.name}</div>
              </div>
            ))}
          </div>
          {children.length === 0 && (
            <ErrorBlock status='empty' />
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
