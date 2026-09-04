import request from "./request";
import type { ApiResponse } from "./types";

interface UploadImageData {
  url: string;
}

export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return request.post<ApiResponse<UploadImageData>>("/uplods/images", formData);
  },
};
