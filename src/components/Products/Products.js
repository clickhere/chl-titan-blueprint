/**
 * Provide Product items to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.slug Used for the product slug.
 * @param {string} props.salePrice Used for the product sale price.
 * @param {string} props.image Used for the product Image array.
 * @param {string} props.imageAltText Used for the product Image Alt tags array.
 * @param {string} props.name Used for the product name/title.
 * @param {string} props.price Used for the product price.
 *
 * @returns {React.ReactElement} The Products component
 */
import styles from './Products.module.scss';
import { classNames } from 'utils';

import Link from 'next/link';

export default function Products({ slug, salePrice, image, imageAltText, name, price }) {



  return (
    <>
      <div className={classNames(['column', 'column-33', styles.productWrapper])}>
        <div className={styles.productImageContainer}>
          <Link href={`/product/${slug}`}>
            <a>
              {
                salePrice !== 0
                ? <span className={styles.onsale}>Sale!</span>
                : null
              }
              <img className={styles.productImage} src={image ?? '/ProductDefault.gif'} alt={imageAltText ?? 'product image'} />

            </a>
          </Link>
        </div>
        <div className={styles.productInfoContainer}>
          <h6 className={styles.productTitle}>
            <Link href={`/product/${slug}`}>
              <a>
                {name}

              </a>
            </Link>
          </h6>
          <div className={styles.productPrice}>
            <span>
              {
                salePrice === 0
                ? '$' + price
                : <><del>${price}</del> ${salePrice}</>
              }
            </span>
          </div>
          <div className={styles.btnContainer}><a className={styles.btn} href="#">View product</a></div>
        </div>
      </div>
    </>
  );
}
