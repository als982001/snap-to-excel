import { useEffect, useRef, useState } from "react";

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
    mutateAsync: extractAsync,
    isPending: isExtracting,
    reset: resetExtract,
  } = useImageExtract();
  const { mutateAsync: saveAsync, isPending: isSaving } = useSaveExtraction();

  const isProcessing = isExtracting || isSaving;

  const isMountedRef = useRef(true);
  const uploadedFilesRef = useRef<IUploadedFile[]>([]);

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      uploadedFilesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const resetDashboard = () => {
    uploadedFilesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));

    setUploadedFiles([]);
    resetExtract();
  };

  const handleFilesChange = (files: IUploadedFile[]) => {
    setUploadedFiles(files);
    resetExtract();
  };

  const handleExtract = async () => {
    if (uploadedFiles.length === 0 || isProcessing) return;

    const filesSnapshot = uploadedFiles;
    const files = filesSnapshot.map((f) => f.file);
    const imageName = filesSnapshot.map((f) => f.file.name).join(", ");

    let data;

    try {
      data = await extractAsync({ files });
    } catch {
      if (!isMountedRef.current) return;

      toast.error("추출에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    if (!isMountedRef.current) return;

    if (data.items.length === 0) {
      toast.info("상품을 찾지 못했습니다.");
      resetDashboard();
      return;
    }

    try {
      await saveAsync({ imageName, items: data.items });
    } catch {
      if (!isMountedRef.current) return;

      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    if (!isMountedRef.current) return;

    try {
      await downloadXlsx({ items: data.items });

      if (!isMountedRef.current) return;

      toast.success(
        `${filesSnapshot.length}장에서 ${data.items.length}개 상품을 추출하고 엑셀로 저장했습니다.`
      );
    } catch {
      if (!isMountedRef.current) return;

      toast.warning(
        "저장은 완료되었지만 엑셀 다운로드에 실패했습니다. History에서 다시 시도해주세요."
      );
    } finally {
      if (isMountedRef.current) resetDashboard();
    }
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
            onClick={resetDashboard}
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
