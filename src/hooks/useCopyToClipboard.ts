import { useState } from "react";

interface UseCopyToClipboardProps {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCopyToClipboard = ({
  timeout = 2000,
  onSuccess,
  onError,
}: UseCopyToClipboardProps = {}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);

      onSuccess?.();

      setTimeout(() => {
        setCopiedId(null);
      }, timeout);

      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      onError?.(error as Error);
      return false;
    }
  };

  return { copiedId, copyToClipboard };
};
