import {useEffect, useRef, useState} from 'react';

export default function Video({
  pcDataSrc,
  mbDataSrc,
}: {
  pcDataSrc?: string;
  mbDataSrc?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [src, setSrc] = useState<string | undefined>('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile && isVisible) {
      setSrc(mbDataSrc);
    } else if (!isMobile && isVisible) {
      setSrc(pcDataSrc);
    }
  }, [pcDataSrc, mbDataSrc, isMobile, isVisible]);

  return (
    <video
      ref={targetRef}
      muted={true}
      autoPlay={true}
      playsInline={true}
      src={src}
    ></video>
  );
}
