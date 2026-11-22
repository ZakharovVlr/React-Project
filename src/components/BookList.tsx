{
  /*
   src/components/BookList.tsx 
*/
}
import { useCallback, useEffect, useState } from 'react';

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

  const [gridNode, setGridNode] = useState<HTMLDivElement | null>(null);
  const gridRef = useCallback((node: HTMLDivElement | null) => {
    setGridNode(node);
  }, []);

  const [columnsCount, setColumnsCount] = useState(1);

  useEffect(() => {
    if (!gridNode) return;

    const updateColumnsCount = (): void => {
      const columns = getComputedStyle(gridNode).gridTemplateColumns.split(' ').length;
      setColumnsCount(columns);
    };

    updateColumnsCount();

    const observer = new ResizeObserver(updateColumnsCount);
    observer.observe(gridNode);

    return (): void => observer.disconnect();
  }, [gridNode]);

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

  const visibleCount = nextUrl
    ? Math.floor(books.length / columnsCount) * columnsCount
    : books.length;
  const visibleBooks = books.slice(0, visibleCount);

  return (
    <>
      <div className='books-list' ref={gridRef}>
        {visibleBooks.map((book) => (
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
              Показано {visibleBooks.length} из {totalCount.toLocaleString('ru-RU')}
            </p>
          )}
        </div>
      )}
    </>
  );
}
