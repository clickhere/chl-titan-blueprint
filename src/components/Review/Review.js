import styles from './Review.module.scss';
import { classNames } from 'utils';

import Link from 'next/link';

export default function Review() {
  return (
    <>
      <ol className={styles.review}>
        <li className={styles.reviewlist}>
          <div className={styles.reviewContainer}>
            <img alt="" src="https://secure.gravatar.com/avatar/427dbff1e52ec95a065f5a6b34225c84?s=60&amp;d=mm&amp;r=g" srcset="https://secure.gravatar.com/avatar/427dbff1e52ec95a065f5a6b34225c84?s=120&amp;d=mm&amp;r=g 2x" className={styles.avatar} height="60" width="60" loading="lazy"/>
            <div className={styles.reviewText}>
              <div className="star-rating" role="img" aria-label="Rated 3 out of 5">
              </div>
              <p className={styles.reviewNameDate}>
                <strong className={styles.reviewAuthor}>Ben </strong>
                <time className={styles.publishedDate} datetime="2021-02-08T21:31:31+00:00">May 1, 2022</time>
              </p>
              <div className="description">
                <p>The hoodie itself felt great and likely would last a really long time; but the sizing was a bit off.</p>
              </div>
            </div>
          </div>
        </li>
        <li className={styles.reviewlist}>
          <div className={styles.reviewContainer}>
            <img alt="" src="https://secure.gravatar.com/avatar/427dbff1e52ec95a065f5a6b34225c84?s=60&amp;d=mm&amp;r=g" srcset="https://secure.gravatar.com/avatar/427dbff1e52ec95a065f5a6b34225c84?s=120&amp;d=mm&amp;r=g 2x" className={styles.avatar} height="60" width="60" loading="lazy"/>
            <div className={styles.reviewText}>
              <div className="star-rating" role="img" aria-label="Rated 3 out of 5">
              </div>
              <p className={styles.reviewNameDate}>
                <strong className={styles.reviewAuthor}>Ben </strong>
                <time className={styles.publishedDate} datetime="2021-02-08T21:31:31+00:00">May 1, 2022</time>
              </p>
              <div className="description">
                <p>The hoodie itself felt great and likely would last a really long time; but the sizing was a bit off.</p>
              </div>
            </div>
          </div>
        </li>
      </ol>
    </>
  );
}
