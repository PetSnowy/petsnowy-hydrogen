import { useLocation } from '@remix-run/react';
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { ReactNode, useLayoutEffect, useMemo, useState, useEffect, useRef, useCallback } from 'react';

export function useVariantUrl(
	handle: string,
	selectedOptions: SelectedOption[],
) {
	const { pathname } = useLocation();

	return useMemo(() => {
		return getVariantUrl({
			handle,
			pathname,
			searchParams: new URLSearchParams(),
			selectedOptions,
		});
	}, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
	handle,
	pathname,
	searchParams,
	selectedOptions,
}: {
	handle: string;
	pathname: string;
	searchParams: URLSearchParams;
	selectedOptions: SelectedOption[];
}) {
	const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
	const isLocalePathname = match && match.length > 0;

	const path = isLocalePathname
		? `${match![0]}products/${handle}`
		: `/products/${handle}`;

	selectedOptions.forEach((option) => {
		searchParams.set(option.name, option.value);
	});

	const searchString = searchParams.toString();

	return path + (searchString ? '?' + searchParams.toString() : '');
}


// 获取header active 导航条的高度
export const getActiveHeaderHeight = () => {
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const activeBar = document.querySelector('.active-bar') as HTMLElement;
		const header = document.querySelector('header') as HTMLElement;
		const updateHeight = () => {
			setHeight(activeBar?.offsetHeight + header?.offsetHeight);
		};
		updateHeight();
		window.addEventListener('resize', updateHeight);
		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	}, []);
	return height
}

export const deviceVisibility = (target: HTMLDivElement | HTMLImageElement | HTMLVideoElement | HTMLElement) => {
	const [isMobile, setIsMobile] = useState(false);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const { pathname } = useLocation();
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
		if (target) observer.observe(target);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	}, [pathname, target]);

	return {
		isMobile, isVisible
	}
}