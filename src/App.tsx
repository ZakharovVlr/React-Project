{
  /*
   src/App.tsx
*/
}
import BookList from './components/BookList';
import SearchForm from './components/SearchForm';
import { useAppSelector } from './hooks/store';

import type { ReactElement } from 'react';

export default function App(): ReactElement {
  const status = useAppSelector((state) => state.search.loadingStatus);
  const error = useAppSelector((state) => state.search.error);

  return (
    <div>
      <h1>Books</h1>
      <SearchForm />
      <p>Статус: {status}</p>
      {status === 'failed' && <div className='error-message'>{error}</div>}
      <BookList />
    </div>
  );
}
