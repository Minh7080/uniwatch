import { ResponseView } from "@/utils/dbTypes"
import { REDDIT_BASE, isValidThumbnail } from "./postUtils"
import { PostImageCarousel } from "./PostImageCarousel"

type CarouselImage = { url: string; width: number; height: number }

function getGalleryImages(media_metadata: unknown, gallery_data: unknown): CarouselImage[] {
  try {
    const meta = media_metadata as Record<string, { s: { u: string; x: number; y: number }; status: string }>
    const gallery = gallery_data as { items: { media_id: string }[] }
    if (!meta || !gallery?.items) return []

    return gallery.items
      .filter(item => meta[item.media_id]?.status === "valid" && meta[item.media_id]?.s?.u)
      .map(item => {
        const src = meta[item.media_id].s
        return { url: src.u.replace(/&amp;/g, "&"), width: src.x, height: src.y }
      })
  } catch {
    return []
  }
}

function getPreviewImage(preview: unknown): CarouselImage | null {
  try {
    const p = preview as { images: [{ source: { url: string; width: number; height: number } }] }
    const src = p?.images?.[0]?.source
    if (!src?.url) return null
    return { url: src.url.replace(/&amp;/g, "&"), width: src.width, height: src.height }
  } catch {
    return null
  }
}

export const PostBody = ({ data }: { data: ResponseView }) => {
  const permalink = data.permalink ? `${REDDIT_BASE}${data.permalink}` : undefined

  const galleryImages = getGalleryImages(data.media_metadata, data.gallery_data)
  const previewImage = galleryImages.length === 0 ? getPreviewImage(data.preview) : null
  const fallbackThumbnail = previewImage === null && isValidThumbnail(data.thumbnail)
    ? [{ url: data.thumbnail!, width: 640, height: 320 }]
    : []

  const images: CarouselImage[] = galleryImages.length > 0
    ? galleryImages
    : previewImage
    ? [previewImage]
    : fallbackThumbnail

  return (
    <a href={permalink} target="_blank" rel="noopener noreferrer" className="block px-3">
      {/* Flair */}
      {data.flair_text && (
        <span className="inline-block text-xs text-base-content/60 bg-base-content/8 px-2 py-0.5 rounded-full mb-1.5 max-w-xs truncate">
          {data.flair_text}
        </span>
      )}

      {/* Title */}
      <h2 className="font-semibold text-base text-base-content leading-snug mb-2">
        {data.title}
      </h2>

      {/* Selftext preview */}
      {data.is_self && data.selftext && (
        <p className="text-sm text-base-content/55 line-clamp-3 leading-relaxed mb-2">
          {data.selftext}
        </p>
      )}

      {/* Image / carousel */}
      <PostImageCarousel images={images} title={data.title} isVideo={data.is_video} />
    </a>
  )
}
