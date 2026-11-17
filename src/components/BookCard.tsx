{
  /*
   src/components/BookCard.tsx
*/
}

/* src/components/BookCard.tsx */
import { useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';

import { useAppDispatch } from '../hooks/store';
import { setActiveBook } from '../store/SearchSlice';

import type { Book } from '../types/api';

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [hasError, setHasError] = useState(false);

  const coverUrl = book.formats['image/jpeg'];
  const authors = book.authors.map((a) => a.name).join(', ') || 'Неизвестный автор';

  return (
    <article className='book-card' onClick={() => dispatch(setActiveBook(book))}>
      <div className='book-card__cover-wrapper'>
        {coverUrl && !hasError ? (
          <img
            src={coverUrl}
            alt={book.title}
            className='book-card__cover'
            loading='lazy'
            onError={() => setHasError(true)}
          />
        ) : (
          <div className='book-card__no-cover'>
            <FaBookOpen size={32} />
          </div>
        )}
      </div>

      <div className='book-card__info'>
        <h3 className='book-card__title' title={book.title}>
          {book.title}
        </h3>
        <p className='book-card__author' title={authors}>
          {authors}
        </p>
      </div>
    </article>
  );
}
