{
  /*
   src/components/BookList.tsx 
*/
}
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { fetchMoreBooks } from '../store/SearchSlice';
import BookCard from './BookCard';
import Loader from './Loader';

import type { ReactElement } from 'react';

export default function BookList(): ReactElement | null {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.search.books);
  const loadingStatus = useAppSelector((state) => state.search.loadingStatus);
  const nextUrl = useAppSelector((state) => state.search.nextUrl);
  const isLoadingMore = useAppSelector((state) => state.search.isLoadingMore);
  const totalCount = useAppSelector((state) => state.search.totalCount);
  if (loadingStatus !== 'succeeded') {
    return null;
  }

  if (books.length === 0) {
    return (
      <div className='books-list__empty'>
        По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
      </div>
    );
  }

  return (
    <>
      <div className='books-list'>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {nextUrl && (
        <div className='books-list__more-wrapper'>
          {isLoadingMore ? (
            <Loader />
          ) : (
            <button
              type='button'
              className='books-list__more-btn'
              onClick={() => void dispatch(fetchMoreBooks(nextUrl))}
            >
              Показать еще
            </button>
          )}

          {totalCount > 0 && (
            <p className='books-list__counter'>
              Показано {books.length} из {totalCount.toLocaleString('ru-RU')}
            </p>
          )}
        </div>
      )}
    </>
  );
}
