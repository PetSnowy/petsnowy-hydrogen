import {useParams, Form, Await, NavLink, useLocation} from '@remix-run/react';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useRef, useState} from 'react';
import {CartForm} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
  IconArrow,
  IconHeaderArrow,
} from '~/components';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {links, useRootLoaderData} from '~/root';
import '~/styles/header/header.css';
import headerLogo from '~/assets/petsnowy/header_logo.png';
import headerIndexLogo from '~/assets/petsnowy/header_index_logo.png';
import litterBox from '~/assets/index/litter_box.png';
import petFeeder from '~/assets/index/pet_feeder.png';
import accessories from '~/assets/index/accessories.png';
import waterFountain from '~/assets/index/water_fountain.png';
import catToy from '~/assets/index/cat_toy.png';

export type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function Layout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  return (
    <div className="root flex flex-col min-h-screen">
      {headerMenu && layout?.shop.name && <Header title={layout.shop.name} />}
      <main role="main" id="mainContent" className="flex-grow">
        {children}
      </main>
      {footerMenu && <Footer menu={footerMenu} />}
    </div>
  );
}

type MenuItem = {
  name: string;
  unfold?: {
    name: string;
    link: string;
    img: string;
  }[];
  link?: string;
};

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

function Header({title}: {title: string}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {/* {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )} */}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu: MenuItem[];
  title: string;
}) {
  const params = useParams();
  const {pathname} = useLocation();

  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    if (!isHome) return;
    const headerScroll = () => {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      scrollTop > 0 ? setScroll(true) : setScroll(false);
    };
    window.addEventListener('scroll', headerScroll);

    return () => {
      window.removeEventListener('scroll', headerScroll);
    };
  }, [isHome]);

  useEffect(() => {
    detailsRef.current?.removeAttribute('open');
  }, [pathname]);
  return (
    <header
      role="banner"
      className={`header ${isHome ? 'index' : ''} ${
        scroll ? 'active' : 'disable'
      }`}
    >
      <div className="flex items-center justify-between container">
        <div className="flex gap-[135px]">
          <Link className="font-bold" to="/" prefetch="intent">
            <img
              className="header-logo"
              src={isHome ? headerIndexLogo : headerLogo}
              alt="petsnowy"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <nav className="items-center flex gap-x-[30px]" role="navigation">
            {menu.map((item, index) => {
              if (item.unfold)
                return (
                  <details key={index} ref={detailsRef}>
                    <summary className="cursor-pointer relative select-none">
                      <span className="text-[15px] font-LeagueSpartanBold text-[#000000]">
                        {item.name}
                      </span>
                      <IconHeaderArrow />
                    </summary>
                    <div className="item-wrapper">
                      {item.unfold.map((v, sub) => (
                        <NavLink
                          key={sub}
                          to={`${
                            params.locale ? params.locale + v.link : v.link
                          }`}
                          end
                        >
                          <span className="text-[15px] font-LeagueSpartanBold text-[#000000]">
                            {v.name}
                          </span>
                          <img
                            src={v.img}
                            alt={v.name}
                            loading="lazy"
                            decoding="async"
                            className="rounded-[5px]"
                          />
                        </NavLink>
                      ))}
                    </div>
                  </details>
                );

              if (item.link)
                return (
                  <NavLink
                    className="text-[15px] font-LeagueSpartanBold text-[#000000] uppercase"
                    prefetch="intent"
                    key={index}
                    to={item.link}
                    end
                  >
                    {item.name}
                  </NavLink>
                );
              return null;
            })}
          </nav>
        </div>
        <div className="flex items-center gap-x-[15px]">
          {/* <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form> */}
          <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount className="w-[30px] h-[30px]" />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin className="w-[25px] h-[25px]" />
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag className="w-[25px] h-[25px]" />
        {count !== 0 && (
          <div className="absolute w-[17px] h-[17px] rounded-[50%] right-0 bottom-0 bg-[#ebe1d9] text-black text-[12px]">
            {count !== 0 ? count : ''}
          </div>
        )}
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}: any) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
