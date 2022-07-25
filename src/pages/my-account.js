import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import LoginForm from 'components/LoginForm/LoginForm';
import {
  Header,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';

export default function Page() {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;

  return (
    <>
      <SEO
        title={pageTitle(generalSettings)}
      />

      <Header />
      
      <Main>
        <div className="container">
          <LoginForm />
        </div>
      </Main>

      <Footer />
    </>
  );
}

export async function getStaticProps(context) {
    return getNextStaticProps(context, {
      Page,
      client,
      revalidate: 1,
    });
}
