import { useEffect, useState } from "react";

import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { IUploadedFile } from "~/types";
import { downloadXlsx } from "~/utils/download";

import { ImageUploader } from "../components/ImageUploader";
import { useImageExtract } from "../hooks/useImageExtract";
import { useSaveExtraction } from "../hooks/useSaveExtraction";

export default function DashboardPage() {
  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]);

  const {
    mutate: extract,
    isPending: isExtracting,
    reset: resetExtract,
  } = useImageExtract();
  const { mutateAsync: saveAsync, isPending: isSaving } = useSaveExtraction();

  const isProcessing = isExtracting || isSaving;

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [uploadedFiles]);

  const cleanupFiles = (files: IUploadedFile[]) => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
  };

  const resetDashboard = () => {
    cleanupFiles(uploadedFiles);

    setUploadedFiles([]);
    resetExtract();
  };

  const handleFilesChange = (files: IUploadedFile[]) => {
    setUploadedFiles(files);
    resetExtract();
  };

  const handleFilesReset = () => {
    resetDashboard();
  };

  const handleExtract = () => {
    if (uploadedFiles.length === 0) return;

    const filesSnapshot = uploadedFiles;
    const files = filesSnapshot.map((f) => f.file);
    const imageName = filesSnapshot.map((f) => f.file.name).join(", ");

    extract(
      { files },
      {
        onSuccess: async (data) => {
          if (data.items.length === 0) {
            toast.info("상품을 찾지 못했습니다.");

            resetDashboard();
            return;
          }

          try {
            await saveAsync({ imageName, items: data.items });
          } catch {
            toast.error("저장에 실패했습니다. 다시 시도해주세요.");
            return;
          }

          try {
            await downloadXlsx({ items: data.items });

            toast.success(
              `${filesSnapshot.length}장에서 ${data.items.length}개 상품을 추출하고 엑셀로 저장했습니다.`
            );
          } catch {
            toast.warning(
              "저장은 완료되었지만 엑셀 다운로드에 실패했습니다. History에서 다시 시도해주세요."
            );
          } finally {
            resetDashboard();
          }
        },
        onError: () => {
          toast.error("추출에 실패했습니다. 다시 시도해주세요.");
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

      {uploadedFiles.length > 0 && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleFilesReset}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-border-color bg-white hover:bg-surface-dark text-text-primary font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            재업로드
          </button>

          <button
            type="button"
            onClick={handleExtract}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-primary hover:bg-gray-800 text-white font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                추출 중... ({uploadedFiles.length}장)
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 및 다운로드 중...
              </>
            ) : (
              `추출하기 (${uploadedFiles.length}장)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
