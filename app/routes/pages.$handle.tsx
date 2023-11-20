import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, useLocation} from '@remix-run/react';
import WhyPetsnowy from '~/components/whyPetsnowy';
import WhyPetsnowyBanner from '~/components/whyPetsnowy/Banner';
import AboutUs from '~/components/aboutUs';
import AboutUsBanner from '~/components/aboutUs/Banner';
import {Fragment, ReactNode} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}: {data: any}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  const {pathname} = useLocation();
  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <AnalysisPageComponent routerName={pathname} />
    </div>
  );
}

function AnalysisPageComponent({
  routerName,
  children,
}: {
  routerName: string;
  children?: ReactNode;
}) {
  const components = new Map([
    ['/pages/why-petsnowy', [<WhyPetsnowy />, <WhyPetsnowyBanner />]],
    ['/pages/about-us', [<AboutUs />, <AboutUsBanner />]],
  ]);

  const componentArray = components.get(routerName);
  return (
    <>
      {componentArray?.map((component, index) => (
        <Fragment key={index}>{component}</Fragment>
      ))}
      {children ?? <Fragment>{children}</Fragment>}
    </>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
