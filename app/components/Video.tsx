import {useEffect, useRef, useState} from 'react';

export default function Video({
  pcDataSrc,
  pcPoster,
  mbDataSrc,
  mbPoster,
}: {
  pcDataSrc?: string;
  pcPoster?: string;
  mbDataSrc?: string;
  mbPoster?: string;
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const targetRef = useRef<HTMLVideoElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [src, setSrc] = useState<string | undefined>('');
  const [poster, setPoster] = useState<string | undefined>('');

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
      setPoster(mbPoster);
    } else if (!isMobile && isVisible) {
      setSrc(pcDataSrc);
      setPoster(pcPoster);
    }
  }, [isMobile, isVisible]);

  return (
    <video
      ref={targetRef}
      muted={true}
      autoPlay={true}
      playsInline={true}
      src={src}
      poster={poster}
    ></video>
  );
}
