import React from "react";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected?: (files: File[]) => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onFilesSelected,
}: CreatePostModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      return isImage || isVideo;
    });

    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected?.(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected?.(files);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md rounded-lg bg-gray-50 max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full rounded-2xl bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-center text-lg font-semibold text-gray-900">
              Create new post
            </h2>
            <button
              onClick={onClose}
              className="text-[#28303F] cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-12">
            {selectedFiles.length === 0 ? (
              <>
                {/* Drop Zone */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`mb-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 transition-colors ${
                    isDragging
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {/* Media Icons */}
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center">
                      <svg
                        viewBox="0 0 64 64"
                        className="h-full w-full text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        {/* Image Icon */}
                        <rect x="8" y="16" width="20" height="20" rx="2" />
                        <circle cx="15" cy="20" r="1.5" />
                        <path d="M8 32l8-8 12 16V16h8v20" />

                        {/* Play Icon */}
                        <rect x="32" y="20" width="20" height="20" rx="2" />
                        <path d="M40 24v12l8-6z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-center text-gray-700">
                    Drag photos and videos here
                  </p>
                </div>

                {/* Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSelectClick}
                    className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 active:bg-green-800"
                  >
                    Select from computer
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Selected Files Display */}
                <div className="mb-6">
                  <p className="mb-3 font-medium text-gray-900">
                    {selectedFiles.length} file
                    {selectedFiles.length !== 1 ? "s" : ""} selected:
                  </p>
                  <div className="space-y-2">
                    {selectedFiles.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 text-sm text-gray-700"
                      >
                        <Upload className="h-4 w-4 text-green-600" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="flex-1 rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 active:bg-green-800"
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
