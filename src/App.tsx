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
import Header from './components/Header';
import Loader from './components/Loader';
import SearchForm from './components/SearchForm';
import { useAppDispatch, useAppSelector } from './hooks/store';
import { fetchBooks } from './store/SearchSlice';

import type { ReactElement } from 'react';

export default function App(): ReactElement {
  const status = useAppSelector((state) => state.search.loadingStatus);
  const error = useAppSelector((state) => state.search.error);
  const { searchQuery, language, topic } = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(fetchBooks());
    return (): void => {
      promise.abort();
    };
  }, [searchQuery, language, topic, dispatch]);
  return (
    <div className='page'>
      <Header />
      <main className='page__content'>
        <SearchForm />
        {!topic && <CategoryList />}
        <CategoryHeader />
        {status === 'loading' && <Loader />}
        {status === 'failed' && <div className='error-message'>{error}</div>}
        <BookList />
      </main>
      <BookModal />
    </div>
  );
}
