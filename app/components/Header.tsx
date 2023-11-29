import {Await, NavLink, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import '~/styles/header/header.css';
import headerLogo from '~/assets/petsnowy/header_logo.png';
import headerIndexLogo from '~/assets/petsnowy/header_index_logo.png';
import litterBox from '~/assets/index/litter_box.png';
import petFeeder from '~/assets/index/pet_feeder.png';
import accessories from '~/assets/index/accessories.png';
import waterFountain from '~/assets/index/water_fountain.png';
import catToy from '~/assets/index/cat_toy.png';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

type MenuItem = {
  name: string;
  unfold?: {
    name: string;
    link: string;
    img: string;
  }[];
  link?: string;
};

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {pathname} = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const [scroll, setScroll] = useState<string>('disable');

  const menu: MenuItem[] = [
    {
      name: 'SHOP SNOW⁺',
      unfold: [
        {
          name: 'snow self cleaning litter box',
          link: '/products/snow-self-cleaning-litter-box',
          img: litterBox,
        },
        {
          name: 'snow pet feeder',
          link: '/products/snow-pet-feeder',
          img: petFeeder,
        },
        {
          name: 'snow water fountain',
          link: '/products/snow-water-fountain',
          img: waterFountain,
        },
        {
          name: 'snow roly poly cat toy',
          link: '/products/snow-roly-poly-cat-toy',
          img: catToy,
        },
        {
          name: 'accessories',
          link: '/collections/accessories',
          img: accessories,
        },
      ],
    },
    {
      name: 'why petsnowy',
      link: '/pages/why-petsnowy',
    },
    {
      name: 'Our Story',
      link: '/pages/about-us',
    },
    {
      name: 'Contact Us',
      link: '/pages/contact',
    },
  ];

  useEffect(() => {
    const scroll = () => {
      if (pathname !== '/') return;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 0 && headerRef.current) {
        setScroll('active');
      } else if (scrollTop <= 0 && headerRef.current) {
        setScroll('disable');
      }
    };
    window.addEventListener('scroll', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
    };
  }, [pathname]);

  return (
    <header
      className={`header ${pathname === '/' ? 'index' : ''} ${scroll}`}
      ref={headerRef}
    >
      <div className="container flex">
        <NavLink prefetch="intent" to="/" end>
          <img
            className="header-logo"
            src={pathname === '/' ? headerIndexLogo : headerLogo}
            alt="petsnowy"
            loading="lazy"
            decoding="async"
          />
        </NavLink>
        <HeaderMenu menu={menu} viewport="desktop" />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  viewport,
}: {
  menu: MenuItem[];
  viewport: Viewport;
}) {
  const className = `header-menu-${viewport}`;
  const {pathname} = useLocation();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  useEffect(() => {
    detailsRef.current?.removeAttribute('open');
  }, [pathname]);

  return (
    <nav className={`${className} items-center`} role="navigation">
      {viewport === 'mobile' && (
        <NavLink end onClick={closeAside} prefetch="intent" to="/">
          Home
        </NavLink>
      )}
      {menu.map((item, index) => {
        if (item.unfold)
          return (
            <details key={index} ref={detailsRef}>
              <summary className="cursor-pointer relative select-none">
                <span>{item.name}</span>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  className="icon icon-caret"
                  viewBox="0 0 10 6"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                    fill="currentColor"
                  ></path>
                </svg>
              </summary>
              <div className="item-wrapper">
                {item.unfold.map((v, sub) => (
                  <NavLink key={sub} to={v.link} end>
                    <span>{v.name}</span>
                    <img
                      src={v.img}
                      alt={v.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </NavLink>
                ))}
              </div>
            </details>
          );

        if (item.link)
          return (
            <NavLink prefetch="intent" key={index} to={item.link} end>
              {item.name}
            </NavLink>
          );

        return null;
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account">
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      {/* <SearchToggle /> */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

function CartBadge({count}: {count: number}) {
  return <a href="#cart-aside">Cart {count}</a>;
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}
