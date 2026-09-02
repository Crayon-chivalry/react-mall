import { useCallback, useEffect, useState } from "react";

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
      if (!enabled || loading) {
        return;
      }

      setLoading(true);

      try {
        const result = await fetcher(targetPage, pageSize);
        const { list: nextList, total: nextTotal } = resolveList(result);

        setList((prev) => (append ? [...prev, ...nextList] : nextList));
        setTotal(nextTotal);

        if (nextTotal > 0) {
          setHasMore(targetPage * pageSize < nextTotal);
        } else {
          setHasMore(nextList.length === pageSize);
        }
      } finally {
        setLoading(false);
      }
    },
    [enabled, fetcher, loading, pageSize, resolveList],
  );

  const goToPage = useCallback(
    async (targetPage: number) => {
      setPage(targetPage);
      await fetchPage(targetPage, false);
    },
    [fetchPage],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPage(nextPage, true);
  }, [fetchPage, hasMore, loading, page]);

  const refresh = useCallback(async () => {
    setPage(initialPage);
    await fetchPage(initialPage, false);
  }, [fetchPage, initialPage]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setList([]);
    setTotal(0);
    setHasMore(true);
  }, [initialPage]);

  useEffect(() => {
    if (autoLoad && enabled) {
      fetchPage(initialPage, false);
    }
  }, [autoLoad, enabled, fetchPage, initialPage]);

  return {
    list,
    page,
    total,
    loading,
    hasMore,
    setPage: goToPage,
    loadMore,
    refresh,
    reset,
  };
};

export default usePagination;
