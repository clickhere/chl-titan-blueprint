import Link from 'next/link';
import Image from 'next/image';
import { FormatDate, LoadingSearchResult } from 'components';
import { FaSearch } from 'react-icons/fa';

import styles from './SearchResults.module.scss';

/**
 * Renders the search results list.
 *
 * @param {Props} props The props object.
 * @param {object[]} props.searchResults The search results list.
 * @param {boolean} props.isLoading Whether the search results are loading.
 * @returns {React.ReactElement} The SearchResults component.
 */
export default function SearchResults({ searchResults, isLoading }) {
  // If there are no results, or are loading, return null.
  if (!isLoading && searchResults === null) {
    return null;
  }

  // If there are no results, return a message.
  if (!isLoading && !searchResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    );
  }

  return (
    <>
      {searchResults?.map((node) => (
        <div key={node?.databaseId ?? ''} className={styles.result}>
          <Link href={node?.uri}>
            <a>
              
              
              <h2 className={styles.title}>
                {node?.name}
              </h2>
              <h3 className={styles.subtitle}>
                ${node?.price}
              </h3>
              {node?.imageUrl !== "" ? <img src={node?.imageUrl} width="250" />  : <img src='/ProductDefault.gif' width="250" />}
            </a>
          </Link>
        </div>
      ))}

      {isLoading === true && (
        <>
          <LoadingSearchResult />
          <LoadingSearchResult />
          <LoadingSearchResult />
        </>
      )}
    </>
  );
}
