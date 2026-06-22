"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";
import { Point, Area } from "react-easy-crop/types";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number; // 1 for square (profile), undefined or free-form for logo
  title?: string;
}

// Utility to extract the cropped portion as a base64 URL
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });

  // Limit maximum dimension to 500px to prevent massive base64 strings
  const MAX_SIZE = 500;
  let scale = 1;
  if (pixelCrop.width > MAX_SIZE || pixelCrop.height > MAX_SIZE) {
    scale = MAX_SIZE / Math.max(pixelCrop.width, pixelCrop.height);
  }

  const outputWidth = pixelCrop.width * scale;
  const outputHeight = pixelCrop.height * scale;

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // Draw the image, scaling it down if necessary
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  // Use PNG to absolutely guarantee transparency preservation. 
  // The MAX_SIZE scale-down above keeps the file size small enough for Local Storage.
  return canvas.toDataURL("image/png");
};

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
  title = "Edit Image",
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error("Failed to crop image", e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-space-950 border border-surface-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-card">
          <h3 className="text-white font-bold tracking-widest uppercase font-mono">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            objectFit="contain"
            showGrid={true}
          />
        </div>

        {/* Controls & Footer */}
        <div className="p-6 bg-surface-card flex flex-col gap-6">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4">
            <ZoomOut className="w-4 h-4 text-text-muted" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-surface-border rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
            <ZoomIn className="w-4 h-4 text-text-muted" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-mono text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors border border-transparent"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2 rounded-lg font-mono text-sm bg-accent-cyan text-space-950 font-bold hover:bg-accent-cyan/90 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.3)] disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply Crop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
