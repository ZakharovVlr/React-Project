{
  /*
   src/App.tsx
*/
}
import { useEffect } from 'react';

import BookList from './components/BookList';
import BookModal from './components/BookModal';
import CategoryHeader from './components/CategoryHeader';
import CategoryList from './components/CategoryList';
import EditorialHero from './components/EditorialHero';
import { ErrorBoundary } from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeShelves from './components/HomeShelves';
import Loader from './components/Loader';
import SearchForm from './components/SearchForm';
import { useAppDispatch, useAppSelector } from './hooks/store';
import { fetchBooks } from './store/SearchSlice';

import type { ReactElement } from 'react';

export default function App(): ReactElement {
  const status = useAppSelector((state) => state.search.loadingStatus);
  const error = useAppSelector((state) => state.search.error);
  const searchQuery = useAppSelector((state) => state.search.searchQuery);
  const language = useAppSelector((state) => state.search.language);
  const topic = useAppSelector((state) => state.search.topic);
  const activeCollectionId = useAppSelector((state) => state.search.activeCollectionId);
  const dispatch = useAppDispatch();

  const isHomeView = !searchQuery && !topic && !activeCollectionId;

  useEffect(() => {
    if (isHomeView || activeCollectionId) return;

    const promise = dispatch(fetchBooks());
    return (): void => {
      promise.abort();
    };
  }, [searchQuery, language, topic, isHomeView, dispatch]);

  return (
    <div className='page'>
      <Header />
      <main className='page__content'>
        <SearchForm />
        {!topic && <CategoryList />}

        {isHomeView ? (
          <ErrorBoundary>
            <>
              <EditorialHero />
              <HomeShelves />
            </>
          </ErrorBoundary>
        ) : (
          <>
            <CategoryHeader />
            {status === 'loading' && <Loader />}
            {status === 'failed' && <div className='error-message'>{error}</div>}
            <ErrorBoundary>
              <BookList />
            </ErrorBoundary>
          </>
        )}
      </main>
      <ErrorBoundary>
        <BookModal />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
