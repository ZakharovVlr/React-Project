{
  /*
   src/components/SearchForm.tsx
*/
}
import { useEffect, useState, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/store';
import { setSearchQuery } from '../store/SearchSlice';

// Импортируем синхронный экшен ввода и асинхронный экшен запроса
import type { Book, APIResponse } from '../types/api';
import type { ReactElement } from 'react';

export default function SearchForm(): ReactElement {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.search.searchQuery);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<Book[]>([]); // Список книг-подсказок
  const [isOpen, setIsOpen] = useState<boolean>(false); // Открыт ли выпадающий список
  const formRef = useRef<HTMLFormElement>(null); // Ссылка на форму для отслеживания кликов снаружи

  useEffect(() => {
    //Как только пользователь ввел минимум 1 символ
    if (inputValue.trim().length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      const fetchSuggestions = async (): Promise<void> => {
        try {
          const baseUrl =
            import.meta.env.VITE_GUTENDEX_URL ?? 'https://gutendex-tqvo.onrender.com';
          const response = await fetch(
            `${baseUrl}/books/?search=${encodeURIComponent(inputValue.trim())}`,
            { signal: controller.signal }
          );

          if (!response.ok) return;

          const data = (await response.json()) as APIResponse;
          setSuggestions(data.results.slice(0, 7));
          setIsOpen(true);
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
        }
      };
      void fetchSuggestions();
    }, 100);

    return (): void => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <form ref={formRef} className='search-bar' onSubmit={(e) => e.preventDefault()}>
      <input
        type='text'
        className='search-bar__input'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Книги, авторы, жанры'
        autoComplete='off'
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className='search-bar__suggestions'>
          {suggestions.map((book) => (
            <li
              key={book.id}
              className='search-bar__suggestion-item'
              onClick={() => {
                setInputValue(book.title);
                dispatch(setSearchQuery(book.title));
                setIsOpen(false);
              }}
            >
              <span className='search-bar__suggestion-title'>{book.title}</span>
              {book.authors[0] && (
                <span className='search-bar__suggestion-author'>
                  {book.authors[0].name}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {inputValue && (
        <button
          type='button'
          className='search-bar__clear-btn'
          onClick={() => {
            setInputValue('');
            dispatch(setSearchQuery(''));
            setSuggestions([]);
            setIsOpen(false);
          }}
          aria-label='Очистить поиск'
        >
          ✕
        </button>
      )}
    </form>
  );
}
