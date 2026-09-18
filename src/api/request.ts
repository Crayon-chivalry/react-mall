import axios from "axios";
import { Toast } from "antd-mobile";

import useUserStore from "@/store/userStore";
import type { ApiResponse } from "./types";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/app",
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 仅对提交类请求展示全局 loading，GET 查询类请求由页面自行处理骨架屏/局部 loading
  const method = config.method?.toLowerCase();
  const isSubmitRequest = ["post", "put", "patch", "delete"].includes(
    method || "",
  );

  if (isSubmitRequest) {
    Toast.show({
      icon: "loading",
      content: "加载中…",
    });
  }

  return config;
});

// 响应拦截器：统一处理后端返回格式
request.interceptors.response.use(
  (response) => {
    // 提交类请求触发的 loading，最终都要在这里清掉；GET 查询类请求不参与全局 loading
    Toast.clear();

    const res = response.data as ApiResponse<any>;
    if (res.code !== 0) {
      const content = res.message || "请求失败";
      Toast.show({
        content,
        icon: "fail",
      });
      return Promise.reject(new Error(content));
    }
    return response;
  },
  (error) => {
    const { status, data } = error. response ?? {};
    // 失败时也要确保全局 loading 被清除，避免页面残留提示
    Toast.clear();
    if (data?.code === 40101 || (status === 401 && !data?.code )) {
      useUserStore.getState().signOut();

      // token 过期，记录当前页面，登录成功后返回
      const currentPath =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      if (window.location.pathname !== "/auth/login") {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(
          currentPath,
        )}`;
      }
    } else {
      const content =
        error?.response?.data?.message || error?.message || String(error);
      Toast.show({
        content,
        icon: "fail",
      });
    }
    return Promise.reject(error);
  },
);

export default request;
