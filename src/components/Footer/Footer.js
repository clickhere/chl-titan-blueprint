
import styles from './Footer.module.scss';
import Link from 'next/link';

/**
 * The Blueprint's Footer component
 * @return {React.ReactElement} The Footer component.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">

        <div className={styles.bar}>

          <div className={styles.terms}>
            <div>
              <Link href="/">
                <a title="Privacy">Privacy Policy</a>
              </Link>
            </div>

            <div>
              <Link href="/">
                <a title="Terms">Terms & Conditions</a>
              </Link>
            </div>
          </div>

          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Blueprint Media &#183; Powered By{' '}
            <a href="https://wpengine.com/atlas">Atlas</a>
          </div>

        </div>


      </div>
    </footer>
  );
}
