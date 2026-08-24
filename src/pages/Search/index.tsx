import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "antd-mobile";
import { DeleteOutline, CloseOutline } from "antd-mobile-icons";

import styles from "./index.module.scss";
import AppNavBar from "@/components/AppNavBar"

const Search = () => {
  const navigate = useNavigate()
  const [isDelete, setIsDelete] = useState(false);
  const [searchList, setSearchList] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("searchList") || "[]")
  );

  // 搜索
  const onSearch = (value: string) => {
    const has = searchList.find((item) => item === value);
    if (has) {
      setSearchList([value, ...searchList.filter((item) => item !== value)]);
    } else {
      setSearchList([value, ...searchList]);
    }
    navigate(`/product/list?keyword=${value}`)
  }

  // 点击搜索记录
  const handClick = (value: string) => {
    if(isDelete) {
      onDeleteItem(value)
    } else {
      onSearch(value)
    }
  }

  // 删除单个
  const onDeleteItem = (value: string) => {
    setSearchList(searchList.filter((item) => item !== value));
  }

  // 清空
  const onClear = () => {
    setSearchList([]);
    setIsDelete(false);
  }

  useEffect(() => {
    localStorage.setItem("searchList", JSON.stringify(searchList));
  }, [searchList])

  return (
    <div className={styles["page"]}>
      <AppNavBar title="搜索" />

      <div className={styles["search"]}>
        <SearchBar placeholder="请输入内容" onSearch={onSearch} />
      </div>

      <div className={styles["record"]}>
        <div className={styles["record-header"]}>
          <div>最近搜索</div>
          {isDelete ? (
            <div className={styles["record-header-right"]}>
              <div onClick={onClear}>全部删除</div>
              <div>|</div>
              <div onClick={() => setIsDelete(false)}>完成</div>
            </div>
          ) : (
            <DeleteOutline onClick={() => setIsDelete(true)} />
          )}
        </div>

        <div className={styles["record-list"]}>
          {searchList.map((item, index) => (
            <div className={styles["record-item"]} key={index} onClick={() => handClick(item)}>
              <span>{item}</span>
              {isDelete && <CloseOutline color="gray" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search