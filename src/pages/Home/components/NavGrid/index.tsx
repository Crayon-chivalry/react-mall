import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper } from "antd-mobile";

import { contentApi } from "@/api/contentApi";
import type { EntriesItem } from "@/api/types"
import { navigateByLink } from "@/utils";
import styles from "./index.module.scss";

interface Props {
  pageSize?: number; // items per page (default 10)
}

const HomeNavGrid = ({ pageSize = 10 }: Props) => {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<EntriesItem[]>([]);
  
  const pages = Math.ceil(entries.length / pageSize);

  const handleClick = (it: EntriesItem) => {
    navigateByLink(it.linkUrl, navigate);
  }

  const renderPage = (pageIndex: number) => {
    const start = pageIndex * pageSize;
    const pageItems = entries.slice(start, start + pageSize);
    const pageClass =
      pageItems.length < 6
        ? `${styles.page} ${styles.compact}`
        : `${styles.page} ${styles.full}`;
    return (
      <Swiper.Item key={pageIndex}>
        <div className={pageClass}>
          {pageItems.map((it) => (
            <div className={styles.item} key={it.id} onClick={() => handleClick(it)}>
              {it.iconUrl ? (
                <img src={it.iconUrl} className={styles.cover} alt={it.title} />
              ) : (
                <div className={styles.placeholder} />
              )}
              <div className={styles.label}>{it.title}</div>
            </div>
          ))}
        </div>
      </Swiper.Item>
    );
  };

  useEffect(() => {
    let active = true;

    const fetchEntries = async () => {
      const { data: res } = await contentApi.homeEntries();
      if (active) setEntries(res.data);
    };

    void fetchEntries();

    return () => {
      active = false;
    };
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className={styles.container}>
      <Swiper
        loop={false}
        indicatorProps={pages <= 1 ? { style: { display: "none" } } : undefined}
        style={{
          "--track-padding": "0 0 12px",
        }}
      >
        {Array.from({ length: pages }).map((_, i) => renderPage(i))}
      </Swiper>
    </div>
  );
};

export default HomeNavGrid;
