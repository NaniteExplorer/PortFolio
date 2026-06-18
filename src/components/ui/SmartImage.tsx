"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Loader3D } from "@/components/ui/Loader3D";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImageProps {
  /** Size of the overlaid 3D loader. Defaults to "md". */
  loaderSize?: "sm" | "md" | "lg";
  loaderVariant?: "css" | "three";
}

/**
 * A drop-in replacement for next/image that shows the Three.js {@link Loader3D}
 * until the image (often a remote URL) finishes downloading, then cross-fades
 * the picture in. The parent element must be positioned (relative) so the
 * absolute loader overlay fills it.
 */
export function SmartImage({
  alt,
  className,
  loaderSize = "md",
  loaderVariant = "three",
  onLoad,
  onError,
  ...props
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        {...props}
        alt={alt}
        className={cn(
          "transition-opacity duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          // Stop showing the loader even if the image fails, so we don't spin
          // forever over a broken URL.
          setLoaded(true);
          onError?.(e);
        }}
      />
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-2">
          {loaderVariant === "css" ? (
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
          ) : (
            <Loader3D size={loaderSize} />
          )}
        </div>
      )}
    </>
  );
}
