{
  /*
   src/components/SearchForm.tsx
*/
}
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/store';
// Импортируем синхронный экшен ввода и асинхронный экшен запроса
import { setSearchQuery } from '../store/SearchSlice';

import type { ReactElement } from 'react';

export default function SearchForm(): ReactElement {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.search.searchQuery);
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        dispatch(setSearchQuery(inputValue));
      }
    }, 350);

    return (): void => clearTimeout(timer);
  }, [inputValue, searchQuery, dispatch]);

  return (
    <form className='search-bar' onSubmit={(e) => e.preventDefault()}>
      <input
        type='text'
        className='search-bar__input'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Книги, авторы, жанры'
        autoComplete='off'
      />

      {inputValue && (
        <button
          type='button'
          className='search-bar__clear-btn'
          onClick={() => {
            setInputValue('');
            dispatch(setSearchQuery(''));
          }}
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
