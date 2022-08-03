import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import {
  ContentWrapper,
  Footer,
  Header,
  EntryHeader,
  Main,
  SEO,
  TaxonomyTerms,
} from 'components';

import styles from 'styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { pageTitle } from 'utils';

import { useRouter } from 'next/router';

import { useState } from 'react';
import Slider from 'react-slick';
import { classNames } from 'utils';

export function ProductComponent({ product }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  
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

      <Header />

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
          
                <p>Categories: {' '}
                {product.productCategories().nodes.map((category, index) => (
                  <>{index === 0 ? '' : ', '}<a href="#">{category.name}</a></>
                ))}
                </p>
            
                <p>Brand: {product.brand.node.name}</p>
              </div>
            </div>
          </div>
        </div>
      </Main>

      <Footer />
    </>
  );
}

function ProductGallery({ images }) {
  const [productIndex, setProductIndex] = useState(0);
  
  return (
    <div className={styles.productGallery}>
      <div><img src={images[productIndex].urlStandard} /></div>
    
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
