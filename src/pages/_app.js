import 'faust.config';
import { FaustProvider } from '@faustjs/next';
import 'normalize.css/normalize.css';
import 'styles/main.scss';
import React from 'react';
import { client } from 'client';
import ThemeStyles from 'components/ThemeStyles/ThemeStyles';

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, far } from "@fortawesome/free-solid-svg-icons";

export default function MyApp({ Component, pageProps }) {

  return (
    <>
      <ThemeStyles />
        <FaustProvider client={client} pageProps={pageProps}>
            <Component {...pageProps} />
        </FaustProvider>
    </>
  );
}
