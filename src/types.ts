export interface Images {
  src: string;
  href?: string;
  alt?: string;
}
export interface CoverflowProps {
  className?: string;
  images: Images[];
  slidesPerSide?: number;
  rotation?: number;
  opacityInterval?: number[];
  scaleInterval?: number[];
}
export interface FetchedItem {
  image: HTMLImageElement;
  alt?: string;
  href?: string;
}
export interface ImageInfo {
  isCurrentImage: boolean;
  isVisible: boolean;
  height: number;
  width: number;
  scaledWidth: number;
  zIndex: number;
  scale: number;
  rotate: number;
  opacity: number;
  src: string;
  href: string;
  alt: string;
}
