
import styles from './Notification.module.scss';
import Link from 'next/link';
import { client } from 'client';

/**
 * The Blueprint's Notification component
 * @return {React.ReactElement} The Notification component.
 */
export default function Notification({storeSettings}) {
    const { useQuery } = client;
    //const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];
  if ( storeSettings?.notificationBanner == '' ) {
    return (null);
  } else {
    return (
        <div className={styles.notificationWrap}>
        <div
            className={styles.layoutColumnWrap}
            style={{ maxWidth: 1200 }}
        >
            <div className={styles.layoutColumn}>
            <div className={styles.layoutColumnInner}>
                <p className={styles.innerText}>
                    { storeSettings?.notificationBanner }
                </p>
            </div>
            </div>
        </div>
        </div>
      );
  }

}
