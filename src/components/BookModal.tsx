{
  /*
   src/components/BookModal.tsx
*/
}
import { useState, useEffect } from 'react';
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

  const [imageError, setImageError] = useState(false);

  // Сбрасываем ошибку обложки при открытии другой книги
  useEffect(() => {
    setImageError(false);
  }, [book?.id]);

  // Если ни одна книга не выбрана — модалка не выводится
  if (!book) return null;

  const coverUrl = book.formats['image/jpeg'];
  const baseUrl =
    import.meta.env.VITE_GUTENDEX_URL ?? 'https://gutendex-tqvo.onrender.com';
  const proxiedCoverUrl = coverUrl
    ? `${baseUrl}/proxy-image/?url=${encodeURIComponent(coverUrl)}`
    : null;
  const authors =
    book.authors.map((a) => formatAuthorName(a.name)).join(', ') || 'Неизвестный автор';

  const showCover = coverUrl && !imageError;
  // Ищем ссылку на чтение/скачивание (обычно html или текстовый формат)
  const readUrl = book.formats['text/html'] || book.formats['text/plain; charset=utf-8'];

  return (
    // Задний полупрозрачный фон. Клик по нему закрывает модалку.
    <div className='book-modal-backdrop' onClick={() => dispatch(setActiveBook(null))}>
      {/* Само белое/темное окошко. e.stopPropagation() не дает окну закрыться при клике внутри него */}
      <div className='book-modal' onClick={(e) => e.stopPropagation()}>
        <button
          type='button'
          className='book-modal__close'
          onClick={() => dispatch(setActiveBook(null))}
        >
          ✕
        </button>

        <div className='book-modal__container'>
          {/* Левая колонка: Обложка */}
          <div className='book-modal__left'>
            <div className='book-modal__cover-wrapper'>
              {showCover ? (
                <img
                  src={proxiedCoverUrl ?? undefined}
                  alt={book.title}
                  className='book-modal__cover'
                  loading='lazy'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='book-modal__no-cover'>
                  <FaBookOpen size={32} />
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка: Информация */}
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
                ⬇ {book.download_count.toLocaleString()} скачиваний
              </span>
            </div>

            <div className='book-modal__details'>
              <h3>О книге</h3>
              <p>
                Этот текст является общественным достоянием и предоставлен каталогом
                Project Gutenberg.
              </p>
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
