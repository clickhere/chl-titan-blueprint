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
  ProductSummary,
  Review,
  ReviewForm,
} from 'components';
import ProductFormField from 'components/ProductFormField/ProductFormField';

import styles from 'styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { pageTitle } from 'utils';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { useState, useMemo } from 'react';
import Slider from 'react-slick';
import { classNames } from 'utils';

import ReactImageMagnify from 'react-image-magnify';

import useTEcom from 'hooks/useTEcom';

export function ProductComponent({ product, relatedProducts }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  const productCategories = product.productCategories().nodes;
  const productBrand = product.brand?.node;

  const productFormFields = JSON.parse(product.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product.modifierLookupJson ?? '{}');

  console.log({ productFormFields, variantLookup, modifierLookup });
  
  const productName = product.name;
  const bigCommerceId = product.bigCommerceID;
  const baseVariantId = product.variants({ last: 1 }).nodes[0]?.bigCommerceVariantID;
  
  const sortedFormFields = useMemo(() => (
    productFormFields.slice().sort((a, b) => a.sort_order - b.sort_order)
  ), [productFormFields]);
  
  const formFieldsById = useMemo(() => {
    return productFormFields.reduce((acc, field) => {
      acc[`${field.prodOptionType}[${field.id}]`] = field;
      return acc;
    }, {});
  }, [productFormFields]);
  
  const { cartData, addToCart } = useTEcom();
  
  const [notificationMessage, setNotificationMessage] = useState();
  
  const [values, setValues] = useState(() => {
    const fields = productFormFields.reduce((acc, field) => {
      acc[`${field.prodOptionType}[${field.id}]`] = (
        field.option_values?.reduce((defaultValue, option) => {
          if (option.is_default) {
            return option.id;
          }
          return defaultValue;
        }, null)
        ?? field.config?.default_value
      );
      return acc;
    }, {});
    
    return {
      ...fields,
      quantity: 1,
    };
  });
  
  const variantProductId = Object.keys(values).reduce((acc, key) => {
    let match;
    if (match = key.match(/^variant\[(.*)\]$/)) {
      acc.push(match[1] + '.' + values[key])
    }
    return acc;
  }, []).sort().join(';');
  
  const variantProduct = variantLookup[variantProductId];
  
  console.log({ values, variantProduct });
  
  function handleChange(event) {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  }
  
  function handleFieldChange(key, value) {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    
    const variantOptionValues = [];
    const modifierOptionValues = [];
    
    Object.keys(values).forEach((key) => {
      const match = key.match(/^(variant|modifier)\[(.*)\]$/);
      const value = values[key];
      if (match) {
        if (match[1] === 'variant') {
          variantOptionValues.push({
            parentOptionID: Number(match[2]),
            optionValueID: value,
          });
        } else if (match[1] === 'modifier') {
          modifierOptionValues.push({
            modifierOptionID: Number(match[2]),
            optionValue: typeof value !== 'number' ? value : '',
            optionValueID: typeof value === 'number' ? value : '',
          });
        }
      }
    });
    
    addToCart([
      {
        quantity: Number(values.quantity),
        product_id: bigCommerceId,
        variant_id: variantProduct?.variant_id ?? baseVariantId,
        variant_option_values: variantOptionValues,
        modifiers: modifierOptionValues,
      },
    ]).then((data) => {
      console.log({ 'addToCart()': data });
      
      if (data.status === 200) {
        setNotificationMessage(`"${productName}" has been added to your cart.`);
        window.scrollTo(0, 0);
      }
    });
  }
  
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
          {
            notificationMessage
            ? (
              <div className={styles.notification}>
                <div className={styles.message}>{notificationMessage}</div>
                <a href={cartData?.redirect_urls?.cart_url}>View cart</a>
              </div>
            )
            : null
          }
          
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
                  ? '$' + product?.price?.toFixed(2)
                  : <><del>${product?.price?.toFixed(2)}</del> ${product?.salePrice?.toFixed(2)}</>
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
                        <>
                          {index === 0 ? '' : ', '}
                          <Link href={`/product-category/${category.slug}`}><a>{category.name}</a></Link>
                        </>
                      ))}
                    </p>
                  : null
                }

                {
                  productBrand
                  ? <p>Brand: {productBrand.name}</p>
                  : null
                }
                
                <form onSubmit={handleSubmit}>
                  {sortedFormFields.map((field) => (
                    <ProductFormField field={field} value={values[`${field.prodOptionType}[${field.id}]`]} onChange={handleFieldChange} key={field.id} />
                  ))}
                
                  <div>
                    <label style={{ display: 'block' }}>Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      style={{
                        width: '5em',
                        padding: '.25em',
                        borderRadius: '4px',
                        borderWidth: '1px',
                      }}
                    />
                  </div>
                
                  <Button styleType="secondary">Add to cart</Button>
                </form>
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
        
        {
          relatedProducts?.length > 0
          ? (
            <div className={classNames(['container', 'related-products'])}>
              <h1>Related Products</h1>
              <div className="row row-wrap">
                {relatedProducts.map((product) => (
                  <ProductSummary product={product} key={product.slug} />
                ))}
              </div>
            </div>
          )
          : null
        }
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
          <img
            src={image.urlThumbnail}
            className={styles.productGalleryThumbnail}
            onClick={() => setProductIndex(index)}
            key={index}
          />
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
  
  const relatedProductIds = JSON.parse(product.relatedProducts ?? '[]');
  const relatedProducts = useQuery().products({ where: { bigCommerceIDIn: relatedProductIds }})?.nodes;

  return <ProductComponent product={product} relatedProducts={relatedProducts} />;
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
