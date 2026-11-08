import { useState, type ReactElement } from 'react';

import { useAppDispatch } from '../hooks/store';
import { setActiveBook } from '../store/SearchSlice';

import type { Book } from '../types/api';

export default function BookCard({ book }: { book: Book }): ReactElement {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const dispatch = useAppDispatch();
  const coverUrl = book.formats['image/jpeg'];
  const authorsString =
    book.authors.map((a) => a.name).join(', ') || 'Неизвестный автор';

  return (
    <article className='book-card' onClick={() => dispatch(setActiveBook(book))}>
      <div className='book-card__cover-wrapper'>
        {coverUrl ? (
          <>
            {/* Если картинка еще не загрузилась, показываем мини-спиннер */}
            {isImageLoading && (
              <div className='book-card__image-loader'>
                <div className='loader__spinner loader__spinner--mini' />
              </div>
            )}
            <img
              src={coverUrl}
              alt={book.title}
              className={`book-card__cover ${isImageLoading ? 'book-card__cover--hidden' : ''}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)} // Снимаем лоадер, если картинки нет на сервере
            />
          </>
        ) : (
          <div className='book-card__no-cover'>Нет обложки</div>
        )}
      </div>
      <div className='book-card__info'>
        <h3 className='book-card__title' title={book.title}>
          {book.title}
        </h3>
        <p className='book-card__author' title={authorsString}>
          {authorsString}
        </p>
        <div className='book-card__footer'>
          <span className='book-card__downloads'>
            ⬇ {book.download_count.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
