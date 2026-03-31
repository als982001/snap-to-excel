import { useCallback } from "react";

import { useDropzone } from "react-dropzone";

import { CloudUpload, X } from "lucide-react";
import type { IUploadedFile } from "~/types";

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface IImageUploaderProps {
  uploadedFile: IUploadedFile | null;
  onFileChange: (file: IUploadedFile | null) => void;
}

export function ImageUploader({
  uploadedFile,
  onFileChange,
}: IImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);

        onFileChange({ file, preview });
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
  });

  const handleRemove = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }

    onFileChange(null);
  };

  if (uploadedFile) {
    return (
      <div className="relative rounded-2xl bg-white shadow-md p-6">
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-4 h-4 text-text-primary" />
        </button>

        <div className="flex flex-col items-center gap-3">
          <img
            src={uploadedFile.preview}
            alt="업로드된 이미지"
            className="max-h-64 rounded-lg object-contain"
          />

          <p className="text-text-secondary text-sm">
            {uploadedFile.file.name} (
            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed bg-white shadow-md px-6 py-14 transition-all cursor-pointer group ${
        isDragActive
          ? "border-primary bg-gray-50 ring-2 ring-primary/30"
          : "border-gray-300 hover:border-primary"
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <CloudUpload
            className={`w-10 h-10 text-text-primary ${isDragActive ? "animate-bounce" : ""}`}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-text-primary text-xl font-bold text-center">
            {isDragActive
              ? "파일을 여기에 놓으세요"
              : "이미지를 드래그 앤 드롭하세요"}
          </p>
          <p className="text-text-secondary text-sm text-center">
            {`JPG, PNG, WEBP 지원 (최대 ${MAX_FILE_SIZE_MB}MB)`}
          </p>
        </div>

        <button
          type="button"
          className="mt-2 flex items-center justify-center rounded-full h-11 px-6 bg-primary hover:bg-gray-800 text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl"
        >
          파일 선택
        </button>
      </div>
    </div>
  );
}
