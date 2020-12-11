import React, { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useTouchEvent from './hooks/useTouchEvent';
import useKeyPress from './hooks/useKeyPress';
import useWindowSize from './hooks/useWindowSize';
import { OPACITY_ORDER, ROTATION, SCALE_ORDER } from './utils/constants';
import { PromiseRejection, PromiseResolution } from './utils/allSettled';
import clamp from './utils/clamp';
import fetchImages from './utils/fetchImages';
import resizeImage from './utils/resizeImage';
import { CoverflowProps, FetchedItem, ImageInfo, Images } from './types';

import './styles.scss';

const isPromiseResolution = <T extends unknown>(
  promise: PromiseResolution<T> | PromiseRejection
): promise is PromiseResolution<T> => {
  return (promise as PromiseResolution<T>).value !== undefined;
};

const Coverflow: FC<CoverflowProps> = props => {
  const { className, images, slidesPerSide, rotation = ROTATION, opacityInterval = OPACITY_ORDER, scaleInterval = SCALE_ORDER } = props;
  /**
   * Sliders per side
   */
  const diff = slidesPerSide + 1 - opacityInterval.length;
  const isSlidesGreaterThanOpacityLength = diff >= 0;
  const slidesGreaterThanOpacityLength = useMemo(
    () => () => [...opacityInterval, ...Array(diff).fill(opacityInterval[opacityInterval.length - 1]), 0],
    [diff, opacityInterval]
  );
  const slidesLessThanOpacityLength = useMemo(() => () => [...opacityInterval.slice(0, slidesPerSide + 1), 0], [
    opacityInterval,
    slidesPerSide,
  ]);
  const opacityIntervalOverride = useMemo(
    () =>
      slidesPerSide
        ? isSlidesGreaterThanOpacityLength
          ? slidesGreaterThanOpacityLength()
          : slidesLessThanOpacityLength()
        : OPACITY_ORDER,
    [isSlidesGreaterThanOpacityLength, slidesGreaterThanOpacityLength, slidesLessThanOpacityLength, slidesPerSide]
  );

  const coverflowRef = useRef<HTMLInputElement | undefined>();
  const [leftEdgeList, setLeftEdgeList] = useState<number[]>([]);
  const [imageList, setImageList] = useState<FetchedItem[]>([]);
  const [imageInfoList, setImageInfoList] = useState<ImageInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height, width } = useWindowSize();
  const leftArrowKeyPress = useKeyPress('ArrowLeft');
  const rightArrowKeyPress = useKeyPress('ArrowRight');
  const [ref, { isMoving, isLeft, isRight }] = useTouchEvent();

  useEffect(() => {
    if (isMoving && isLeft) {
      setCurrentIndex(currentIndex => (currentIndex > 0 ? currentIndex - 1 : currentIndex));
    }
    if (isMoving && isRight) {
      setCurrentIndex(currentIndex => (currentIndex < imageList.length - 1 ? currentIndex + 1 : currentIndex));
    }
  }, [isMoving, isLeft, isRight, imageList.length]);

  /**
   * Arrow Keys
   */
  useEffect(() => {
    if (leftArrowKeyPress) {
      setCurrentIndex(currentIndex => (currentIndex > 0 ? currentIndex - 1 : currentIndex));
    }
    if (rightArrowKeyPress) {
      setCurrentIndex(currentIndex => (currentIndex < imageList.length - 1 ? currentIndex + 1 : currentIndex));
    }
  }, [leftArrowKeyPress, rightArrowKeyPress, imageList.length]);

  /**
   * Image fetch
   */
  useEffect(() => {
    const fetch = async (originalImageList: Images[]) => {
      const fetchedImages = await fetchImages(originalImageList);
      const succeedImages = fetchedImages
        .filter(({ status }) => {
          return status === 'fulfilled';
        })
        .map(item => {
          if (isPromiseResolution(item)) {
            return item.value;
          }

          return undefined;
        });
      setImageList(succeedImages);
      setCurrentIndex(Math.floor(succeedImages.length / 2));
    };
    fetch(images);
  }, [images]);

  /**
   * Sizing / Edges
   */
  useLayoutEffect(() => {
    let leftEdgeList: number[] = []; // raw image no scale applied
    let imageInfoList: ImageInfo[] = [];
    let edge = 0;
    const coverflowHeight =
      coverflowRef.current !== undefined ? coverflowRef.current.getBoundingClientRect().height : 0;
    const coverflowWidth = coverflowRef.current !== undefined ? coverflowRef.current.getBoundingClientRect().width : 0;

    imageList.forEach((image, index) => {
      const {
        image: { src },
        href,
        alt,
      } = image;
      const imageInfo = {} as ImageInfo;
      const distanceFromMiddle = index - currentIndex;
      const absDistanceFromMiddle = Math.abs(index - currentIndex);
      const scale = scaleInterval[clamp(absDistanceFromMiddle, 0, scaleInterval.length - 1)];
      const imageDimension = resizeImage(coverflowHeight, coverflowWidth, image.image);
      const scaledWidth = imageDimension.width * scale;
      leftEdgeList.push(edge);
      const rotate = index > currentIndex ? -rotation : index === currentIndex ? 0 : rotation;
      const zIndex = 100 - absDistanceFromMiddle;
      const opacity = opacityIntervalOverride[clamp(absDistanceFromMiddle, 0, opacityIntervalOverride.length - 1)];
      const isVisible =
        opacityIntervalOverride[absDistanceFromMiddle] !== 0 &&
        opacityIntervalOverride[absDistanceFromMiddle] !== undefined;

      imageInfo.isCurrentImage = index === currentIndex;
      imageInfo.isVisible = isVisible;
      imageInfo.height = imageDimension.height;
      imageInfo.width = imageDimension.width;
      imageInfo.scaledWidth = scaledWidth;
      imageInfo.zIndex = zIndex;
      imageInfo.scale = scale;
      imageInfo.rotate = rotate;
      imageInfo.opacity = opacity;
      imageInfo.src = src;
      imageInfo.href = href;
      imageInfo.alt = alt;

      // LEFT HAND SIDE
      if (distanceFromMiddle < 0) {
        // we only want to move 20% so they overlap
        edge += scaledWidth * 0.2;
      } else {
        // RIGHT HAND SIDE
        const { image: nextImage } = imageList[index + 1] || {};
        if (nextImage) {
          const nextImageDistanceFromCenter = index + 1 - currentIndex;
          const nextScale = scaleInterval[clamp(Math.abs(nextImageDistanceFromCenter), 0, scaleInterval.length - 1)];
          const nextImageDimension = resizeImage(coverflowHeight, coverflowWidth, nextImage);
          const nextImageScaledWidth = nextImageDimension.width * nextScale;
          edge += scaledWidth - nextImageScaledWidth + nextImageScaledWidth * 0.2;
        } else {
          edge += scaledWidth;
        }
      }

      imageInfoList.push(imageInfo);
    });

    setImageInfoList(imageInfoList);
    setLeftEdgeList(leftEdgeList);
  }, [currentIndex, imageList, height, width, scaleInterval, opacityIntervalOverride]);

  const handleButtonClick = (index = 0, href: string) => {
    if (index === currentIndex && href) {
      window.open(href, '_blank');
    }
    setCurrentIndex(index);
  };

  if (!imageInfoList.length) {
    return null;
  }

  return (
    <div className="main">
      <div className={`${className ?? ''} coverflow-wrapper`} ref={ref}>
        <div
          ref={coverflowRef}
          className="coverflow"
          style={{
            transform: `translateX(-${leftEdgeList[currentIndex] + imageInfoList[currentIndex]?.width / 2}px)`,
          }}
        >
          {imageInfoList.map((imageInfo, index) => {
            const {
              zIndex,
              href,
              src,
              alt,
              scaledWidth,
              width,
              height,
              rotate,
              opacity,
              scale,
              isCurrentImage,
              isVisible,
            } = imageInfo;
            const leftPosition = leftEdgeList[index];
            return (
              <div
                key={index}
                className={`coverflow__image-container ${isVisible ? 'coverflow__image-container--visible' : ''} ${
                  isCurrentImage ? 'coverflow__image-container--active' : ''
                }`}
                style={{
                  zIndex: zIndex,
                  left: `${leftPosition}px`,
                  width: `${scaledWidth}px`,
                  height: `${height}px`,
                }}
              >
                <button
                  className="coverflow__button"
                  tabIndex={isCurrentImage && href ? 0 : -1}
                  onClick={() => {
                    if (isVisible) {
                      handleButtonClick(index, href);
                    }
                  }}
                  style={{
                    transform: `scale(${scale}) rotateY(${rotate}deg)`,
                    pointerEvents: isVisible ? 'all' : 'none',
                    cursor: `${isCurrentImage && href ? 'pointer' : ''}`,
                  }}
                >
                  <img
                    className="coverflow__image"
                    src={src}
                    style={{
                      height: `${height}px`,
                      width: `${width}px`,
                      opacity: `${opacity}`,
                    }}
                    alt={alt}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Coverflow;
