import {
  Link as RemixLink,
  NavLink as RemixNavLink,
  type NavLinkProps as RemixNavLinkProps,
  type LinkProps as RemixLinkProps,
} from '@remix-run/react';

import {useRootLoaderData} from '~/root';

type LinkProps = Omit<RemixLinkProps, 'className'> & {
  className?: RemixNavLinkProps['className'] | RemixLinkProps['className'];
};

// 自动添加路由前缀
export function Link(props: LinkProps) {
  const {to, className, ...resOfProps} = props;
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale;

  let toWithLocale = to;

  if (typeof to === 'string') {
    toWithLocale = !to.includes(selectedLocale.pathPrefix)
      ? `${selectedLocale.pathPrefix}${to}`
      : to;
  }

  if (typeof className === 'function') {
    return (
      <RemixNavLink to={toWithLocale} className={className} {...resOfProps} />
    );
  }

  return <RemixLink to={toWithLocale} className={className} {...resOfProps} />;
}
