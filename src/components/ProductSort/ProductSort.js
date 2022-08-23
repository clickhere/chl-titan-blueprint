import styles from './ProductSort.module.scss';
import { classNames } from 'utils';
import { useState } from 'react';
import ProductSummary from 'components/ProductSummary';

export default function ProductSort({ products }) {
  const productsMap = products.map((product, index) => ({
    product,
    index,
    price: (product.salePrice === 0 ? product.price : product.salePrice),
    rating: product.reviewsRating,
    popularity: product.totalSold,
    latest: product.bigCommerceID,
  }));
  
  const [sorted, setSorted] = useState({ order: 'index', products: productsMap });
  
  function sortBy(order) {
    setSorted({
      order,
      products: productsMap.slice().sort((a, b) => {
        if (order === 'index') {
          return a.index - b.index;
        }
        if (order === 'popularity') {
          return b.popularity - a.popularity;
        }
        if (order === 'rating') {
          return b.rating - a.rating;
        }
        if (order === 'latest') {
          return b.latest - a.latest;
        }
        if (order === 'price-asc') {
          return a.price - b.price;
        }
        if (order === 'price-desc') {
          return b.price - a.price;
        }
        return 0;
      })
    });
  }
  
  function SortUI() {
    return (
      <div className="column">
        <select onChange={(event) => sortBy(event.target.value)} value={sorted.order}>
          <option value="index">Default sorting</option>
          <option value="popularity">Sort by popularity</option>
          <option value="rating">Sort by average rating</option>
          <option value="latest">Sort by latest</option>
          <option value="price-asc">Sort by price: low to high</option>
          <option value="price-desc">Sort by price: high to low</option>
        </select>
        &nbsp;&nbsp;Showing all {products.length} results
      </div>
    );
  }
  
  return (
    <>
      <SortUI />
    
      {sorted.products.map(({ product }) => (
        <ProductSummary product={product} key={product.slug} />
      ))}
      
      <SortUI />
    </>
  );
}
