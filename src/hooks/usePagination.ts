import { useCallback, useEffect, useRef, useState } from "react";

type PageResult<T> =
  | T[]
  | {
      list?: T[];
      total?: number;
      data?: {
        list?: T[];
        total?: number;
      };
    };

type UsePaginationOptions<T> = {
  fetcher: (page: number, pageSize: number) => Promise<PageResult<T>>;
  pageSize?: number;
  initialPage?: number;
  autoLoad?: boolean;
  enabled?: boolean;
};

export const usePagination = <T>({
  fetcher,
  pageSize = 10,
  initialPage = 1,
  autoLoad = true,
  enabled = true,
}: UsePaginationOptions<T>) => {
  const [list, setList] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const loadingRef = useRef(false);
  const pageRef = useRef(initialPage);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const resolveList = useCallback((result: PageResult<T>) => {
    if (Array.isArray(result)) {
      return {
        list: result,
        total: result.length,
      };
    }

    const payloadList = result.list ?? result.data?.list ?? [];
    const payloadTotal = result.total ?? result.data?.total ?? payloadList.length;

    return {
      list: payloadList,
      total: payloadTotal,
    };
  }, []);

  const fetchPage = useCallback(
    async (targetPage: number, append = false) => {
      if (!enabled || loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);

      try {
        const result = await fetcher(targetPage, pageSize);
        const { list: nextList, total: nextTotal } = resolveList(result);

          setList((prev) => (append ? [...prev, ...nextList] : nextList));
        setPage(targetPage);
        setTotal(nextTotal);
        setInitialized(true);

        if (nextTotal > 0) {
          setHasMore(targetPage * pageSize < nextTotal);
        } else {
          setHasMore(nextList.length === pageSize);
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [enabled, fetcher, pageSize, resolveList],
  );

  const goToPage = useCallback(
    async (targetPage: number) => {
      await fetchPage(targetPage, false);
    },
    [fetchPage],
  );

  const loadMore = useCallback(async () => {
    if (!initialized || !hasMoreRef.current || loadingRef.current) {
      return;
    }

    const nextPage = pageRef.current + 1;
    await fetchPage(nextPage, true);
  }, [fetchPage, initialized]);

  const refresh = useCallback(async () => {
    setInitialized(false);
    await fetchPage(initialPage, false);
  }, [fetchPage, initialPage]);

  const reset = useCallback(() => {
    pageRef.current = initialPage;
    setPage(initialPage);
    setList([]);
    setTotal(0);
    setHasMore(true);
    setInitialized(false);
    hasMoreRef.current = true;
  }, [initialPage]);

  const updateItem = useCallback(
    (
      key: string | number,
      getKey: (item: T) => string | number,
      updater: (item: T) => T | null,
    ) => {
      setList((prev) =>
        prev.flatMap((item) => {
          if (getKey(item) !== key) return [item];

          const nextItem = updater(item);
          return nextItem ? [nextItem] : [];
        }),
      );
    },
    [],
  );

  useEffect(() => {
    if (autoLoad && enabled) {
      void fetchPage(initialPage, false);
    }
  }, [autoLoad, enabled, fetchPage, initialPage]);

  return {
    list,
    page,
    total,
    loading,
    hasMore,
    initialized,
    setPage: goToPage,
    loadMore,
    refresh,
    reset,
    updateItem,
  };
};

export default usePagination;
