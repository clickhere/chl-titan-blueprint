import styles from './ProductSort.module.scss';
import { classNames } from 'utils';
import { useState } from 'react';
import ProductSummary from 'components/ProductSummary';

export default function ProductSort({ products }) {
  const productsMap = products.map((product, index) => ({
    product,
    index,
    price: (product.salePrice === 0 ? product.price : product.salePrice),
  }));
  
  const [sorted, setSorted] = useState({ order: 'index-asc', products: productsMap });
  
  function sortBy(order) {
    setSorted({
      order,
      products: productsMap.slice().sort((a, b) => {
        if (order === 'index-asc') {
          return a.index - b.index;
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
          <option value="index-asc">Default sorting</option>
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
