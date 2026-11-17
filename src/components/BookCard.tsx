{
  /*
   src/components/BookCard.tsx
*/
}
import { useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';

import { useAppDispatch } from '../hooks/store';
import { setActiveBook } from '../store/SearchSlice';

import type { Book } from '../types/api';

type BookCardProps = {
  book: Book;
};

function formatAuthorName(name: string): string {
  const [last, first] = name.split(', ');
  return first ? `${first} ${last}` : last;
}

export default function BookCard({ book }: BookCardProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);

  const coverUrl = book.formats['image/jpeg'];
  const baseUrl =
    import.meta.env.VITE_GUTENDEX_URL ?? 'https://gutendex-tqvo.onrender.com';
  const proxiedCoverUrl = coverUrl
    ? `${baseUrl}/proxy-image/?url=${encodeURIComponent(coverUrl)}`
    : null;
  const authors =
    book.authors.map((a) => formatAuthorName(a.name)).join(', ') || 'Неизвестный автор';

  const showCover = coverUrl && !imageError;

  return (
    <article className='book-card' onClick={() => dispatch(setActiveBook(book))}>
      <div className='book-card__cover-wrapper'>
        {showCover ? (
          <img
            src={proxiedCoverUrl ?? undefined}
            alt={book.title}
            className='book-card__cover'
            loading='lazy'
            onError={() => setImageError(true)}
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
        <div className='book-card__footer'>
          <span className='book-card__downloads'>
            ⬇ {book.download_count.toLocaleString('ru-RU')}
          </span>
        </div>
      </div>
    </article>
  );
}
