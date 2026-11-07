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
      // Ключевое слово void сообщает линтеру, что мы не обрабатываем промис прямо здесь
      void dispatch(fetchBooks());
    }
  };

  return (
    <form className='search-form' onSubmit={handleSubmit}>
      {/* Контейнер-обертка для позиционирования элементов внутри инпута */}
      <div className='search-form__wrapper'>
        <input
          type='text'
          className='search-form__input'
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder='Поиск книг или авторов...'
          autoComplete='off'
        />

        {/* Кнопка очистки — показываем, только если в инпуте есть текст */}
        {searchQuery && (
          <button
            type='button'
            className='search-form__clear-btn'
            onClick={() => dispatch(setSearchQuery(''))}
            aria-label='Очистить поиск'
          >
            <svg viewBox='0 -960 960 960' fill='currentColor'>
              <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
            </svg>
          </button>
        )}
      </div>

      {/* Основная кнопка отправки формы */}
      <button type='submit' className='search-form__submit-button'>
        Найти
      </button>
    </form>
  );
}
