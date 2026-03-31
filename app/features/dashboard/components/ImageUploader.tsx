import { useCallback } from "react";

import { useDropzone } from "react-dropzone";

import { CloudUpload, X } from "lucide-react";
import type { IUploadedFile } from "~/types";

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface IImageUploaderProps {
  uploadedFiles: IUploadedFile[];
  onFilesChange: (files: IUploadedFile[]) => void;
}

export function ImageUploader({
  uploadedFiles,
  onFilesChange,
}: IImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      onFilesChange([...uploadedFiles, ...newFiles]);
    },
    [uploadedFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: true,
  });

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(uploadedFiles[index].preview);

    onFilesChange(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
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
              {`JPG, PNG, WEBP 지원 (최대 ${MAX_FILE_SIZE_MB}MB, 여러 장 가능)`}
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

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploadedFiles.map((uploaded, index) => (
            <div
              key={uploaded.preview}
              className="relative rounded-xl bg-white shadow-md p-3 group"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <X className="w-3.5 h-3.5 text-text-primary" />
              </button>

              <img
                src={uploaded.preview}
                alt={`업로드 ${index + 1}`}
                className="w-full h-28 rounded-lg object-cover"
              />

              <p className="text-text-secondary text-xs mt-2 truncate">
                {uploaded.file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
