{
  /*
   src/components/BookModal.tsx
*/
}
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { setActiveBook } from '../store/SearchSlice';

import type { ReactElement } from 'react';

export default function BookModal(): ReactElement | null {
  const book = useAppSelector((state) => state.search.activeBook);
  const dispatch = useAppDispatch();

  // Если ни одна книга не выбрана — модалка не выводится
  if (!book) return null;

  const coverUrl = book.formats['image/jpeg'];
  const authorsString =
    book.authors.map((a) => a.name).join(', ') || 'Неизвестный автор';

  // Ищем ссылку на чтение/скачивание (обычно html или текстовый формат)
  const readUrl = book.formats['text/html'] || book.formats['text/plain; charset=utf-8'];

  return (
    // Задний полупрозрачный фон. Клик по нему закрывает модалку.
    <div className='book-modal-backdrop' onClick={() => dispatch(setActiveBook(null))}>
      {/* Само белое/темное окошко. e.stopPropagation() не дает окну закрыться при клике внутри него */}
      <div className='book-modal' onClick={(e) => e.stopPropagation()}>
        <button
          className='book-modal__close'
          onClick={() => dispatch(setActiveBook(null))}
        >
          ✕
        </button>

        <div className='book-modal__container'>
          {/* Левая колонка: Обложка */}
          <div className='book-modal__left'>
            <div className='book-modal__cover-wrapper'>
              {coverUrl ? (
                <img src={coverUrl} alt={book.title} className='book-modal__cover' />
              ) : (
                <div className='book-modal__no-cover'>Нет обложки</div>
              )}
            </div>
          </div>

          {/* Правая колонка: Информация */}
          <div className='book-modal__right'>
            <span className='book-modal__type-tag'>Книга</span>
            <h2 className='book-modal__title'>{book.title}</h2>
            <p className='book-modal__author'>{authorsString}</p>

            <div className='book-modal__actions'>
              {readUrl && (
                <a
                  href={readUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='book-modal__btn-read'
                >
                  Читать онлайн
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
