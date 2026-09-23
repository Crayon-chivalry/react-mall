import request from "./request";

interface UploadImageData {
  url: string;
}

export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return request.post<UploadImageData>("/uploads/images", formData);
  },
};
