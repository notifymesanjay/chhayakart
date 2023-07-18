import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useResponsive } from '../use-responsive';
import styles from './dk-carousel.module.scss';

const DkCarousel = forwardRef(
  (
    {
      slidesToShow = 1,
      gap = 16,
      partialVisible = false,
      partialVisibilityGutter = 24,
      className = '',
      containerClass = '',
      showDots = false,
      dotWrapperClass = '',
      children,
    },
    ref
  ) => {
    const sliderRef = useRef();
    const { isMobile, screenSize } = useResponsive();
    const [items, setItems] = useState([]);
    const [itemWidth, setItemWidth] = useState('100%');
    const [currentSlide, setCurrentSlide] = useState(0);

    const goToSlide = (slideIndex) => {
      if (sliderRef && sliderRef.current) {
        const itemWidthInPx = Number(itemWidth) || 0;
        sliderRef.current.scrollLeft = (itemWidthInPx + gap) * slideIndex;
      }
    };

    const onScroll = useCallback(
      (e) => {
        if (showDots) {
          const itemWidthInPx = Number(itemWidth) || 0;
          const scrollPos = e.target.scrollLeft;
          if (itemWidthInPx > 0) {
            const activeItemIndex = Math.round(scrollPos / itemWidthInPx);
            setCurrentSlide(
              activeItemIndex < 0
                ? 0
                : activeItemIndex >= items.length
                ? items.length
                : activeItemIndex
            );
          }
        }
      },
      [itemWidth, showDots, items.length]
    );

    const handleDotClick = useCallback(
      (slideIndex) => {
        if (currentSlide !== slideIndex) {
          setCurrentSlide(slideIndex);
          goToSlide(slideIndex);
        }
      },
      [currentSlide]
    );

    useImperativeHandle(ref, () => ({
      goToSlide,
    }));

    useEffect(() => {
      setItems(Array.isArray(children) ? children : [children]);
    }, [children]);

    useEffect(() => {
      if (sliderRef && sliderRef.current) {
        const gapBetweenSlides = gap * (slidesToShow - 1);
        const partialVisibleItemWidth = partialVisible
          ? partialVisibilityGutter + gap
          : 0;
        const totalGap = gapBetweenSlides + partialVisibleItemWidth;
        const totalWidth = sliderRef.current.clientWidth;
        setItemWidth((totalWidth - totalGap) / slidesToShow);
      }
    }, [
      slidesToShow,
      gap,
      partialVisible,
      partialVisibilityGutter,
      sliderRef,
      screenSize,
    ]);

    return useMemo(
      () => (
        <div className={`${styles.sliderContainer} ${containerClass}`}>
          <div
            ref={sliderRef}
            className={`${styles.slider} ${
              isMobile ? styles.mobView : ''
            } ${className}`}
            onScroll={onScroll}>
            {items.map((child, index) => (
              <div
                className={`${styles.slide}`}
                style={{ width: itemWidth }}
                key={index}>
                {child}
              </div>
            ))}
          </div>
          {showDots && (
            <div className={`${styles.dotWrapper} ${dotWrapperClass}`}>
              {items.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.dot} ${
                    index === currentSlide ? styles.active : ''
                  }`}
                  onClick={() => {
                    handleDotClick(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ),
      [
        itemWidth,
        items,
        className,
        containerClass,
        showDots,
        dotWrapperClass,
        isMobile,
        screenSize,
        currentSlide,
        partialVisible,
        handleDotClick,
      ]
    );
  }
);

export default DkCarousel;
