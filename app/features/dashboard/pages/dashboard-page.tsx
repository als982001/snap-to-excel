import { useEffect, useState } from "react";

import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { IProduct, IUploadedFile } from "~/types";

import { ImageUploader } from "../components/ImageUploader";
import { ProductTable } from "../components/ProductTable";
import { useImageExtract } from "../hooks/useImageExtract";
import { useSaveExtraction } from "../hooks/useSaveExtraction";

export default function DashboardPage() {
  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]);
  const [extractedItems, setExtractedItems] = useState<IProduct[]>([]);

  const {
    mutate: extract,
    isPending: isExtracting,
    reset: resetExtract,
  } = useImageExtract();
  const { mutate: save, isPending: isSaving } = useSaveExtraction();

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [uploadedFiles]);

  const handleFilesChange = (files: IUploadedFile[]) => {
    setUploadedFiles(files);
    setExtractedItems([]);
    resetExtract();
  };

  const handleFilesReset = () => {
    uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));

    setUploadedFiles([]);
    setExtractedItems([]);
    resetExtract();
  };

  const handleExtract = () => {
    if (uploadedFiles.length === 0) return;

    const files = uploadedFiles.map((f) => f.file);

    extract(
      { files },
      {
        onSuccess: (data) => {
          setExtractedItems(data.items);

          if (data.items.length > 0) {
            toast.success(
              `${uploadedFiles.length}장에서 ${data.items.length}개 상품을 추출했습니다.`
            );
          } else {
            toast.info("상품을 찾지 못했습니다.");
          }
        },
        onError: () => {
          toast.error("추출에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  const handleSave = () => {
    if (uploadedFiles.length === 0 || extractedItems.length === 0) return;

    const imageNames = uploadedFiles.map((f) => f.file.name).join(", ");

    save(
      { imageName: imageNames, items: extractedItems },
      {
        onSuccess: () => {
          uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));

          setUploadedFiles([]);
          setExtractedItems([]);
          resetExtract();
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>

      <ImageUploader
        uploadedFiles={uploadedFiles}
        onFilesChange={handleFilesChange}
      />

      {uploadedFiles.length > 0 && extractedItems.length === 0 && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleFilesReset}
            disabled={isExtracting}
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-border-color bg-white hover:bg-surface-dark text-text-primary font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            재업로드
          </button>

          <button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-primary hover:bg-gray-800 text-white font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                추출 중... ({uploadedFiles.length}장)
              </>
            ) : (
              `추출하기 (${uploadedFiles.length}장)`
            )}
          </button>
        </div>
      )}

      <ProductTable items={extractedItems} onItemsChange={setExtractedItems} />

      {extractedItems.length > 0 && (
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-primary hover:bg-gray-800 text-white font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              저장 중...
            </>
          ) : (
            "저장하기"
          )}
        </button>
      )}
    </div>
  );
}
