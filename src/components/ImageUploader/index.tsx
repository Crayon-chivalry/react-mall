import {
  ImageUploader as AntdImageUploader,
  type ImageUploadItem,
  type ImageUploaderProps as AntdImageUploaderProps,
} from "antd-mobile";

import { uploadApi } from "@/api/uploadApi";

export type PublicImageUploaderProps = Omit<AntdImageUploaderProps, "upload">;

const ImageUploader = (props: PublicImageUploaderProps) => {
  const upload = async (file: File): Promise<ImageUploadItem> => {
    const { data: response } = await uploadApi.image(file);
    return {
      url: response.data.url,
    };
  };

  return <AntdImageUploader accept="image/*" {...props} upload={upload} />;
};

export default ImageUploader;
