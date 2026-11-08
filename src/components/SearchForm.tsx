{
  /*
   src/components/SearchForm.tsx
*/
}
import { useAppDispatch, useAppSelector } from '../hooks/store';
// Импортируем синхронный экшен ввода и асинхронный экшен запроса
import { setSearchQuery, fetchBooks } from '../store/SearchSlice';

import type { ReactElement } from 'react';

export default function SearchForm(): ReactElement {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.search.searchQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void dispatch(fetchBooks());
    }
  };

  return (
    <form className='search-bar' onSubmit={handleSubmit}>
      <input
        type='text'
        className='search-bar__input'
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        placeholder='Книги, авторы, жанры'
        autoComplete='off'
      />

      {searchQuery && (
        <button
          type='button'
          className='search-bar__clear-btn'
          onClick={() => dispatch(setSearchQuery(''))}
          aria-label='Очистить поиск'
        >
          <svg viewBox='0 -960 960 960' fill='currentColor'>
            <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
          </svg>
        </button>
      )}
    </form>
  );
}
