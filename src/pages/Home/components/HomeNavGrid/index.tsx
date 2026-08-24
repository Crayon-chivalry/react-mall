import { Swiper } from "antd-mobile";
import styles from "./index.module.scss";
import type { EntriesItem } from "@/api/types"

interface Props {
  items?: EntriesItem[];
  pageSize?: number; // items per page (default 10)
}

const HomeNavGrid = ({ items = [], pageSize = 10 }: Props) => {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));

  const renderPage = (pageIndex: number) => {
    const start = pageIndex * pageSize;
    const pageItems = items.slice(start, start + pageSize);
    const pageClass = pageItems.length < 6 ? `${styles.page} ${styles.compact}` : `${styles.page} ${styles.full}`;
    return (
      <Swiper.Item key={pageIndex}>
        <div className={pageClass}>
          {pageItems.map((it, idx) => (
            <div className={styles.item} key={idx}>
              {it.iconUrl ? (
                <img src={it.iconUrl} className={styles.cover} />
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

  return (
    <div className={styles.container}>
      <Swiper
        loop={false}
        indicatorProps={pages <= 1 ? { style: { display: 'none' } } : undefined}
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
