import {
  ImageUploader as AntdImageUploader,
  type ImageUploadItem,
  type ImageUploaderProps as AntdImageUploaderProps,
} from "antd-mobile";
import { useRef } from "react";

import { uploadApi } from "@/api/uploadApi";

export type PublicImageUploaderProps = Omit<AntdImageUploaderProps, "upload"> & {
  replaceOnPreview?: boolean;
  preview?: boolean;
};

const ImageUploader = (props: PublicImageUploaderProps) => {
  const uploaderRef = useRef<{ nativeElement: HTMLInputElement | null }>(null);
  const {
    replaceOnPreview = false,
    preview = true,
    onPreview,
    ...uploaderProps
  } = props;

  const upload = async (file: File): Promise<ImageUploadItem> => {
    const { data: response } = await uploadApi.image(file);
    return {
      key: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}`,
      url: response.data.url,
    };
  };

  const handlePreview: NonNullable<AntdImageUploaderProps["onPreview"]> = (
    index,
    item,
  ) => {
    if (replaceOnPreview) {
      uploaderRef.current?.nativeElement?.click();
      return;
    }
    onPreview?.(index, item);
  };

  return (
    <AntdImageUploader
      ref={uploaderRef}
      accept="image/*"
      {...uploaderProps}
      preview={preview}
      onPreview={handlePreview}
      upload={upload}
    />
  );
};

export default ImageUploader;
