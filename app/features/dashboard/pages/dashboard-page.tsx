import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { IProduct, IUploadedFile } from "~/types";

import { ImageUploader } from "../components/ImageUploader";
import { ProductTable } from "../components/ProductTable";
import { useImageExtract } from "../hooks/useImageExtract";
import { useSaveExtraction } from "../hooks/useSaveExtraction";

export default function DashboardPage() {
  const [uploadedFile, setUploadedFile] = useState<IUploadedFile | null>(null);
  const [extractedItems, setExtractedItems] = useState<IProduct[]>([]);

  const {
    mutate: extract,
    isPending: isExtracting,
    reset: resetExtract,
  } = useImageExtract();
  const { mutate: save, isPending: isSaving } = useSaveExtraction();

  useEffect(() => {
    return () => {
      if (uploadedFile?.preview) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
    };
  }, [uploadedFile]);

  const handleFileChange = (file: IUploadedFile | null) => {
    setUploadedFile(file);
    setExtractedItems([]);
    resetExtract();
  };

  const handleExtract = () => {
    if (!uploadedFile) return;

    extract(
      { file: uploadedFile.file },
      {
        onSuccess: (data) => {
          setExtractedItems(data.items);

          if (data.items.length > 0) {
            toast.success("추출이 완료되었습니다.");
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
    if (!uploadedFile || extractedItems.length === 0) return;

    save(
      { imageName: uploadedFile.file.name, items: extractedItems },
      {
        onSuccess: () => {
          setUploadedFile(null);
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
        uploadedFile={uploadedFile}
        onFileChange={handleFileChange}
      />

      {uploadedFile && extractedItems.length === 0 && (
        <button
          type="button"
          onClick={handleExtract}
          disabled={isExtracting}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-primary hover:bg-gray-800 text-white font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              추출 중...
            </>
          ) : (
            "추출하기"
          )}
        </button>
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
