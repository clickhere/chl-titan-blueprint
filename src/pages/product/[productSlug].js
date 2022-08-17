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
  Button,
  ProductShortView,
  Review,
  ReviewForm,
} from 'components';
import ProductFormField from 'components/ProductFormField/ProductFormField';

import styles from 'styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { pageTitle } from 'utils';

import { useRouter } from 'next/router';

import { useState } from 'react';
import Slider from 'react-slick';
import { classNames } from 'utils';

import ReactImageMagnify from 'react-image-magnify';

export function ProductComponent({ product }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  const productCategories = product.productCategories().nodes;
  const productBrand = product.brand?.node;

  const productFormFields = JSON.parse(product.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product.modifierLookupJson ?? '{}');

  console.log({ productFormFields, variantLookup, modifierLookup });

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          product?.title(),
          generalSettings?.title
        )}
        imageUrl={product?.featuredImage?.node?.sourceUrl?.()}
      />

      <Header
        storeSettings={storeSettings}
      />
      <Notification
        storeSettings={storeSettings}
      />


      <Main>
        <div className={classNames(['container', styles.product])}>
          <div className="row">
            <div className="column column-40">
              <ProductGallery images={product.images().nodes} />
            </div>

            <div className="column">
              {
                product?.salePrice !== 0
                ? <span className={styles.onsale}>Sale!</span>
                : null
              }

              <h1>{product?.name}</h1>

              <p className="price" style={{
                fontSize: '1.41575em',
                margin: '1.41575em 0',
              }}>
                {
                  product?.salePrice === 0
                  ? '$' + product?.price
                  : <><del>${product?.price}</del> ${product?.salePrice}</>
                }
              </p>

              <p dangerouslySetInnerHTML={{ __html: product?.description }} />

              <div className="product_meta">
                <p>SKU: {product?.sku}</p>

                {
                  productCategories?.length
                  ? <p>
                      Categories: {' '}
                      {product.productCategories().nodes.map((category, index) => (
                        <>{index === 0 ? '' : ', '}<a href="#">{category.name}</a></>
                      ))}
                    </p>
                  : null
                }

                {
                  productBrand
                  ? <p>Brand: {productBrand.name}</p>
                  : null
                }

                {productFormFields.map((field) => (
                  <ProductFormField field={field} />
                ))}

                {/*<pre>{JSON.stringify(productFormFields, null, 2)}</pre>*/}

                <div>
                  <label style={{ display: 'block' }}>Quantity:</label>
                  <input type="number" min="1" step="1" defaultValue="1" style={{
                    width: '5em',
                    padding: '.25em',
                    borderRadius: '4px',
                    borderWidth: '1px',
                  }} />
                </div>

                <Button styleType="secondary">Add to cart</Button>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(['container', 'related-products'])}>
          <div className="row row-wrap">
            <div className="column">
              <h1>[count] reviews for {product?.name}</h1>
              <Review

              />
            </div>

          </div>
        </div>
        <div className={classNames(['container', 'review-product'])}>
          <div className="row row-wrap">
            <div className="column">
              <ReviewForm />
            </div>
          </div>
        </div>
        <div className={classNames(['container', 'related-products'])}>
          <div className="row">
            <div className="column">
              <h1>Related Products</h1>
              <p>BigCommerce ID: {product?.bigCommerceID} | Related products: {product?.relatedProducts}</p>
              <ProductShortView
                slug={product.slug}
                salePrice={product.salePrice}
                image={product.images({ first: 1})?.nodes?.[0]?.urlStandard}
                name={product.name}
                productPrice={product.productPrice}
                price={product.price}
              />
            </div>
          </div>
        </div>
      </Main>

      <Footer
        storeSettings={storeSettings}
      />
    </>
  );
}

function ProductGallery({ images }) {
  const [productIndex, setProductIndex] = useState(0);

  return (
    <div className={styles.productGallery}>
      <div>
        <ReactImageMagnify {...{
          smallImage: {
            alt: 'Wristwatch by Ted Baker London',
            isFluidWidth: true,
            src: images[productIndex]?.urlStandard
          },
          largeImage: {
            src: images[productIndex]?.urlZoom,
            width: 960,
            height: 1080
          }
        }} />
      </div>

      <Slider
        dots={false}
        infinite={false}
        slidesToShow={4}
        slidesToScroll={4}
      >
        {images.map((image, index) => (
          <img src={image.urlThumbnail} className={styles.productGalleryThumbnail} onClick={() => setProductIndex(index)} />
        ))}
      </Slider>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { query } = router;
  const { useQuery } = client;
  const product = useQuery().product({ id: query.productSlug, idType: 'SLUG' });

  return <ProductComponent product={product} />;
}

export async function getStaticProps(context) {
  const product = await client.client.inlineResolved(() => {
    return client.client.query.product({ id: context.params.productSlug, idType: 'SLUG' });
  });

  return getNextStaticProps(context, {
    Page,
    client,
    notFound: !product,
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
