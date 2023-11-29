import {useLocation} from '@remix-run/react';
import {ReactNode, Fragment, useEffect, useRef, useState} from 'react';
import {deviceVisibility} from '~/utils';

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
  const currentPageComponents = pageComponents.get(pageName);
  const commonComponents = pageComponents.get('*'); // 获取通用组件

  const shouldRenderCommonComponents =
    !excludedPages || !excludedPages.includes(pageName);

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
  height?: number;
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
  const {isVisible, isMobile} = deviceVisibility(targetRef.current!);

  useEffect(() => {
    console.log(isMobile, isVisible);
    if (isMobile && isVisible) {
      setSrc(mbDataSrc);
      setPoster(mbPoster);
    } else if (!isMobile && isVisible) {
      setSrc(pcDataSrc);
      setPoster(pcPoster);
    }
  }, [isMobile, isVisible, mbDataSrc, mbPoster, pcDataSrc, pcPoster]);

  return (
    <video
      style={{height: height && window.innerHeight - height}}
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
  const {isVisible, isMobile} = deviceVisibility(targetRef.current!);

  useEffect(() => {
    if (isMobile && isVisible && mobileImg && targetRef.current) {
      targetRef.current.src = mobileImg;
    } else if (!isMobile && isVisible && pcImg && targetRef.current) {
      targetRef.current.src = pcImg;
    }
  }, [isMobile, isVisible]);

  return <img alt={alt} decoding="async" loading="lazy" ref={targetRef} />;
}
