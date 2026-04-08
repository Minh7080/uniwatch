import { ResponseView } from "@/utils/dbTypes"
import { isValidThumbnail } from "./postUtils"
import { PostImageCarousel } from "./PostImageCarousel"
import Markdown from "react-markdown"
import cn from "@/utils/cn"

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
    return null;
  }
}

function getVideo(video: unknown): CarouselImage | null {
  try {
    const v = video as {
      secure_media: {
        reddit_video: {
          dash_url: string;
          fallback_url: string,
          hls_url: string,
          width: number,
          height: number,
        }
      }
    }

    const reddit_video = v?.secure_media?.reddit_video || undefined;
    const src = reddit_video?.hls_url ?? reddit_video?.fallback_url ?? reddit_video?.dash_url;
    if (!src) return null;
    return { url: src, width: reddit_video.width, height: reddit_video.height }
  } catch {
    return null;
  }
}

export const PostBody = ({ data, isExpanded }: { data: ResponseView, isExpanded: boolean }) => {
  const video = data.is_video ? getVideo(data) : null;
  const galleryImages = getGalleryImages(data.media_metadata, data.gallery_data)
  const previewImage = galleryImages.length === 0 ? getPreviewImage(data.preview) : null
  const fallbackThumbnail = previewImage === null && isValidThumbnail(data.thumbnail)
    ? [{ url: data.thumbnail!, width: 640, height: 320 }]
    : [];

  const images: CarouselImage[] = (() => {
    if (video) return [video]
    if (galleryImages.length > 0) return galleryImages;
    if (previewImage) return [previewImage];
    return fallbackThumbnail;
  })();

  // galleryImages.length > 0
  //   ? galleryImages
  //   : previewImage
  //     ? [previewImage]
  //     : fallbackThumbnail

  return (
    <div className="block px-3">
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
        <div className={cn("text-sm text-base-content/55 leading-relaxed mb-2", isExpanded ? "" : "line-clamp-3")}>
          <Markdown
            components={{
              p: ({ children }) => <span>{children} </span>,
              a: ({ href, children }) => (
                <
                  a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  {children}
                </a>
              )

            }}
          >
            {data.selftext}
          </Markdown>
        </div>
      )}

      {/* Image / carousel */}
      <PostImageCarousel images={images} title={data.title} isVideo={data.is_video} />
    </div>
  )
}
