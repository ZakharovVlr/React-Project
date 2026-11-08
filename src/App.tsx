{
  /*
   src/App.tsx
*/
}
import BookList from './components/BookList';
import BookModal from './components/BookModal';
import CategoryList from './components/CategoryList';
import Header from './components/Header';
import Loader from './components/Loader';
import SearchForm from './components/SearchForm';
import { useAppSelector } from './hooks/store';

import type { ReactElement } from 'react';

export default function App(): ReactElement {
  const status = useAppSelector((state) => state.search.loadingStatus);
  const error = useAppSelector((state) => state.search.error);

  return (
    <div className='page'>
      <Header />
      <main className='page__content'>
        <SearchForm />
        <CategoryList />
        {status === 'loading' && <Loader />}
        {status === 'failed' && <div className='error-message'>{error}</div>}
        <BookList />
      </main>
      <BookModal />
    </div>
  );
}
