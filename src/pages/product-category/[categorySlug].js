import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import {
  ContentWrapper,
  Footer,
  Header,
  Notification,
  EntryHeader,
  Main,
  SEO,
  TaxonomyTerms,
  ProductShortView,
} from 'components';
import styles from 'styles/pages/_Shop.module.scss';
import { pageTitle } from 'utils';
import { classNames } from 'utils';

import Link from 'next/link';

export function ShopComponent({ products }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          'Product Category',
          generalSettings?.title
        )}
        imageUrl={false/*product?.featuredImage?.node?.sourceUrl?.()*/}
      />

      <Header
      storeSettings={storeSettings}
      />
      <Notification
        storeSettings={storeSettings}
      />

      <Main>
        <div className="container">
          <section className={styles.bannerHero}>
            <div className="hero-content-container row">
              <div className={classNames(['column', styles.heroContent])}>
                <nav className={styles.breadcrumbsContainer}>
                  <ul className={styles.breadcrumbs}>
                    <li className={styles.breadcrumb}>
                      <a href="/"><span>Home</span></a>
                    </li>
                    <li className={styles.breadcrumb}>
                      <a href="/product-category/"><span>Product Category</span></a>
                    </li>
                    <li className={classNames([styles.breadcrumb, styles.isActive])}>
                      <span>Hoodies & Jackets</span>
                    </li>
                  </ul>
                </nav>
                <h1 className="section-header">Hoodies &amp; Jackets</h1>
                <div className="category-description">
                  <p><span>Stay warm during winter or weight cut with our MMA Hoodies. Or stay warm before your next match with our BJJ Hoodies and jackets. Rep your passion with our Hoodies and Jackets Selection.</span></p>
                </div>
              </div>
              <div className={classNames(['column', styles.heroImage])}>
                <img src="https://cdn11.bigcommerce.com/s-mobtsc45qz/images/stencil/1280x1280/f/hoodies-jackets-updated-image__2021_category.original.jpg" alt="Hoodies &amp; Jackets" title="Hoodies &amp; Jackets" />
              </div>
            </div>
          </section>
          <div className={styles.shopTitle}>
            <h1>Product Category</h1>
          </div>

          <div className={classNames(['row', 'row-wrap', styles.shop])}>
            {products.map((product) => (
              <ProductShortView
                slug={product.slug}
                salePrice={product.salePrice}
                image={product.images({ first: 1})?.nodes?.[0]?.urlStandard}
                name={product.name}
                productPrice={product.productPrice}
                price={product.price}
              />

            ))}
          </div>
        </div>
      </Main>

      <Footer
      storeSettings={storeSettings}
      />
    </>
  );
}

export default function Page() {
  const { useQuery } = client;
  const products = useQuery().products({ first: 100 });

  return <ShopComponent products={products?.nodes} />;
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    revalidate: 1,
    // notFound: await is404(context, { client }),
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
