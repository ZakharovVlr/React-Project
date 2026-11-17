{
  /*
   src/components/BookModal.tsx
*/
}

import { useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';

import { useAppSelector, useAppDispatch } from '../hooks/store';
import { setActiveBook } from '../store/SearchSlice';

import type { ReactElement } from 'react';

function formatAuthorName(name: string): string {
  const [last, first] = name.split(', ');
  return first ? `${first} ${last}` : last;
}

export default function BookModal(): ReactElement | null {
  const book = useAppSelector((state) => state.search.activeBook);
  const dispatch = useAppDispatch();
  const [failedBookId, setFailedBookId] = useState<number | null>(null);

  if (!book) return null;

  const coverUrl = book.formats['image/jpeg'];
  const showCover = Boolean(coverUrl) && failedBookId !== book.id;

  const authors =
    book.authors.map((a) => formatAuthorName(a.name)).join(', ') || 'Неизвестный автор';

  const readUrl =
    book.formats['text/html'] ||
    book.formats['text/plain; charset=utf-8'] ||
    book.formats['text/plain; charset=us-ascii'];

  const handleClose = (): void => {
    dispatch(setActiveBook(null));
  };

  return (
    <div className='book-modal-backdrop' onClick={handleClose}>
      <div className='book-modal' onClick={(e) => e.stopPropagation()}>
        <button
          type='button'
          className='book-modal__close'
          onClick={handleClose}
          aria-label='Закрыть'
        >
          ✕
        </button>

        <div className='book-modal__container'>
          <div className='book-modal__left'>
            <div className='book-modal__cover-wrapper'>
              {showCover ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className='book-modal__cover'
                  onError={() => setFailedBookId(book.id)}
                />
              ) : (
                <div className='book-modal__no-cover'>
                  <FaBookOpen size={32} />
                </div>
              )}
            </div>
          </div>

          <div className='book-modal__right'>
            <span className='book-modal__type-tag'>Книга</span>
            <h2 className='book-modal__title'>{book.title}</h2>
            <p className='book-modal__author'>{authors}</p>

            <div className='book-modal__actions'>
              {readUrl && (
                <a
                  href={readUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='book-modal__btn-read'
                >
                  Читать
                </a>
              )}
              <span className='book-modal__downloads'>
                ⬇ {book.download_count.toLocaleString('ru-RU')} скачиваний
              </span>
            </div>

            <div className='book-modal__details'>
              <div className='book-modal__about'>
                <h3>О книге</h3>
                {book.summaries && book.summaries.length > 0 ? (
                  <p className='book-modal__description'>{book.summaries[0]}</p>
                ) : (
                  <p className='book-modal__description'>
                    {book.subjects && book.subjects.length > 0
                      ? `Жанры и темы: ${book.subjects.slice(0, 4).join(', ')}.`
                      : 'Этот текст является общественным достоянием и предоставлен каталогом библиотеки.'}
                  </p>
                )}
              </div>

              {book.languages.length > 0 && (
                <div className='book-modal__meta-item'>
                  <strong>Язык оригинала:</strong>{' '}
                  {book.languages.join(', ').toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
