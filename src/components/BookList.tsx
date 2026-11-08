{
  /*
   src/components/BookList.tsx 
*/
}
import { useAppSelector } from '../hooks/store';
import BookCard from './BookCard';

import type { ReactElement } from 'react';

export default function BookList(): ReactElement | null {
  const books = useAppSelector((state) => state.search.books);
  const loadingStatus = useAppSelector((state) => state.search.loadingStatus);

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
    <div className='books-list'>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
