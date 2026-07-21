import { useNavigate } from "react-router-dom";
import { SideBar } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";

import styles from "./index.module.scss";

const tabs = [
  { id: 1, title: "服饰箱包" },
  { id: 2, title: "食品" },
  { id: 3, title: "电器" },
  { id: 4, title: "手机" },
];

const Category = () => {
  const navigate = useNavigate();

  const onSearchClick = () => {
    navigate("/search");
  };

  return (
    <>
      <div className={styles["header"]}>
        <div className={styles["search"]} onClick={onSearchClick}>
          <SearchOutline />
          <div>请输入内容</div>
        </div>
      </div>

      <div className={styles["category-row"]}>
        <SideBar>
          {tabs.map((item) => (
            <SideBar.Item key={item.id} title={item.title} />
          ))}
        </SideBar>
        <div className={styles["content"]}>
          <div className={styles["grid"]}>
            <div className={styles["grid-item"]}>
              <img
                src="/src/assets/images/xiaomi.png"
                className={styles["grid-cover"]}
              />
              <div className="grid-name">小米</div>
            </div>
            <div className={styles["grid-item"]}>
              <img
                src="/src/assets/images/xiaomi.png"
                className={styles["grid-cover"]}
              />
              <div className="grid-name">小米</div>
            </div>
            <div className={styles["grid-item"]}>
              <img
                src="/src/assets/images/xiaomi.png"
                className={styles["grid-cover"]}
              />
              <div className="grid-name">小米</div>
            </div>
            <div className={styles["grid-item"]}>
              <img
                src="/src/assets/images/xiaomi.png"
                className={styles["grid-cover"]}
              />
              <div className="grid-name">小米</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
