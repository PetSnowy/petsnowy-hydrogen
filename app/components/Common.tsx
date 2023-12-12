import {useLocation} from '@remix-run/react';
import {ReactNode, Fragment, useEffect, useRef, useState} from 'react';

// 配置不同页面渲染不同的组件
export function PageRenderer({
  pageName,
  children,
  pageComponents,
  excludedPages,
}: {
  pageName: string;
  children?: ReactNode;
  pageComponents: Map<string, ReactNode[]>;
  excludedPages?: string[];
}) {
  const router = pageName.split('/').at(-1);
  const getKey = [...pageComponents.keys()].find((key) =>
    key.includes(router!),
  );
  const currentPageComponents = pageComponents.get(getKey!);
  const commonComponents = pageComponents.get('*'); // 获取通用组件

  const shouldRenderCommonComponents =
    !excludedPages || !excludedPages.includes(router!);

  return (
    <>
      {currentPageComponents?.map((component, index) => (
        <Fragment key={index}>{component}</Fragment>
      ))}
      {shouldRenderCommonComponents &&
        commonComponents?.map((component, index) => (
          <Fragment key={`common-${index}`}>{component}</Fragment>
        ))}
      {children ?? <Fragment>{children}</Fragment>}
    </>
  );
}
type VideoProps = {
  pcDataSrc?: string;
  pcPoster?: string;
  mbDataSrc?: string;
  mbPoster?: string;
  height?: string;
};
// 视频懒加载组件
export function Video({
  pcDataSrc,
  pcPoster,
  mbDataSrc,
  mbPoster,
  height,
}: VideoProps) {
  const targetRef = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | undefined>('');
  const [poster, setPoster] = useState<string | undefined>('');

  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {pathname} = useLocation();
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(entry.isIntersecting);
        }
      });
    }, options);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname, targetRef.current]);

  useEffect(() => {
    if (isVisible) {
      const src = isMobile ? mbDataSrc ?? pcDataSrc : pcDataSrc ?? mbDataSrc;
      const poster = isMobile ? mbPoster ?? pcPoster : pcPoster ?? mbPoster;
      setSrc(src);
      setPoster(poster);
    }
  }, [isMobile, isVisible, mbDataSrc, mbPoster, pcDataSrc, pcPoster]);

  return (
    <video
      style={{height}}
      className="object-cover w-full"
      ref={targetRef}
      muted={true}
      autoPlay={true}
      playsInline={true}
      src={src}
      poster={poster}
    ></video>
  );
}
// 图片懒加载组件
type LazyImageProps = {
  pcImg?: string;
  mobileImg?: string;
  alt: string;
};

export function LazyImage({pcImg, mobileImg, alt}: LazyImageProps) {
  const targetRef = useRef<HTMLImageElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {pathname} = useLocation();
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(entry.isIntersecting);
        }
      });
    }, options);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname, targetRef.current]);

  useEffect(() => {
    if (isVisible && targetRef.current) {
      const imgSrc = isMobile ? mobileImg ?? pcImg : pcImg ?? mobileImg;
      targetRef.current.src = imgSrc!;
    }
  }, [isMobile, isVisible, pcImg, mobileImg]);

  return <img alt={alt} decoding="async" loading="lazy" ref={targetRef} />;
}
