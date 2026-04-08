"use client"
import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselImage = {
  url: string
  width: number
  height: number
}

type Props = {
  images: CarouselImage[]
  title: string
  isVideo: boolean | null
}

export const PostImageCarousel = ({ images, title, isVideo }: Props) => {
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  const current = images[index]
  const isSingle = images.length === 1

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-base-300 mb-2">
      {
        isVideo
          ? (
            <video 
              src={current.url} 
              controls
              className="object-contain w-full max-h-120"
            />
          ) : (
            <Image
              src={current.url}
              alt={`${title} — ${index + 1} of ${images.length}`}
              width={current.width || 960}
              height={current.height || 540}
              quality={90}
              className="object-contain w-full max-h-120"
            />
          )
      }

      {isVideo && isSingle && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-12 rounded-full bg-black/50 flex items-center justify-center">
            <svg className="size-5 text-white fill-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {!isSingle && (
        <>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setIndex(i => Math.max(0, i - 1)) }}
            disabled={index === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center disabled:opacity-30 transition-[opacity,background-color]"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setIndex(i => Math.min(images.length - 1, i + 1)) }}
            disabled={index === images.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center disabled:opacity-30 transition-[opacity,background-color]"
            aria-label="Next image"
          >
            <ChevronRight className="size-5 text-white" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); e.stopPropagation(); setIndex(i) }}
                className={`size-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 text-xs text-white bg-black/50 rounded-full px-2 py-0.5">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
