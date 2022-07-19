import * as MENUS from 'constants/menus';

import { classNames as cn } from 'utils';
import { useState } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { NavigationMenu, SkipNavigationLink } from 'components';
import { client } from 'client';

import styles from './Header.module.scss';
/**
 * A Header component
 * @param {Props} props The props object.
 * @param {string} props.className An optional className to be added to the container.
 * @return {React.ReactElement} The FeaturedImage component.
 */
export default function Header({ className }) {
  const [isNavShown, setIsNavShown] = useState(false);

  const headerClasses = cn([styles.header, className]);
  const navClasses = cn([
    styles['primary-navigation'],
    isNavShown ? styles['show'] : undefined,
  ]);
  
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;

  return (
    <header className={headerClasses}>
      <SkipNavigationLink />
      <div className="container">
        <div className={styles['bar']}>
          <div className={styles['logo']}>
            
            <Link href="/">
              <a title="Home">
                <h3>{generalSettings?.title}</h3>
                {generalSettings?.description}
              </a>
            </Link>
          </div>

          <div className={styles['search']}>
            <Link href="/search">
              <a>
                <FaSearch title="Search" role="img" />
              </a>
            </Link>
          </div>

          <button
            type="button"
            className={styles['nav-toggle']}
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label="Toggle navigation"
            aria-controls={styles['primary-navigation']}
            aria-expanded={isNavShown}
          >
           <FaBars />
          </button>

        </div>

        <div className={styles['bar']}>
          <NavigationMenu
            id={styles['primary-navigation']}
            className={navClasses}
            menuLocation={MENUS.PRIMARY_LOCATION}
          >

          </NavigationMenu>
          
          <span className={styles['icon-cart']}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M171.7 191.1H404.3L322.7 35.07C316.6 23.31 321.2 8.821 332.9 2.706C344.7-3.409 359.2 1.167 365.3 12.93L458.4 191.1H544C561.7 191.1 576 206.3 576 223.1C576 241.7 561.7 255.1 544 255.1L492.1 463.5C484.1 492 459.4 512 430 512H145.1C116.6 512 91 492 83.88 463.5L32 255.1C14.33 255.1 0 241.7 0 223.1C0 206.3 14.33 191.1 32 191.1H117.6L210.7 12.93C216.8 1.167 231.3-3.409 243.1 2.706C254.8 8.821 259.4 23.31 253.3 35.07L171.7 191.1zM191.1 303.1C191.1 295.1 184.8 287.1 175.1 287.1C167.2 287.1 159.1 295.1 159.1 303.1V399.1C159.1 408.8 167.2 415.1 175.1 415.1C184.8 415.1 191.1 408.8 191.1 399.1V303.1zM271.1 303.1V399.1C271.1 408.8 279.2 415.1 287.1 415.1C296.8 415.1 304 408.8 304 399.1V303.1C304 295.1 296.8 287.1 287.1 287.1C279.2 287.1 271.1 295.1 271.1 303.1zM416 303.1C416 295.1 408.8 287.1 400 287.1C391.2 287.1 384 295.1 384 303.1V399.1C384 408.8 391.2 415.1 400 415.1C408.8 415.1 416 408.8 416 399.1V303.1z"/></svg>
          </span>
        </div>



      </div>
    </header>
  );
}
