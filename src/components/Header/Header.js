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
        </div>



      </div>
    </header>
  );
}
