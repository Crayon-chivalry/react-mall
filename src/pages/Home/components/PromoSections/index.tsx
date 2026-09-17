import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { contentApi } from "@/api/contentApi";
import type { PromoImageItems, PromoSectionsItem } from "@/api/types";
import { navigateByLink } from "@/utils";
import styles from "./index.module.scss";


const PromoSections = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<PromoSectionsItem[]>([]);

  useEffect(() => {
    let active = true;

    const fetchPromoSections = async () => {
      const { data: res } = await contentApi.promoSections();
      if (active) setList(res.data);
    };

    void fetchPromoSections();

    return () => {
      active = false;
    };
  }, []);

  const handleClick = (item: PromoImageItems) => {
    navigateByLink(item.linkUrl, navigate);
  };

  if (list.length === 0) return null;

  return (
    <section className={styles.container} aria-label="活动专区">
      {list.map((section) => (
        <div
          className={`${styles.section} ${styles[section.layoutType]}`}
          key={section.id}
        >
          {section.imageItems.map((item, index) => (
            <button
              className={styles.item}
              key={item.id ?? `${section.id}-${index}`}
              type="button"
              onClick={() => handleClick(item)}
              disabled={!item.linkUrl}
            >
              <img src={item.imageUrl} alt={item.title || section.title} />
            </button>
          ))}
        </div>
      ))}
    </section>
  );
};

export default PromoSections;