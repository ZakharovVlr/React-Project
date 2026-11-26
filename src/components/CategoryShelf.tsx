//src/components/CategoryShelf.tsx
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '../hooks/store';
import { setTopic } from '../store/SearchSlice';
import BookCard from './BookCard';

import type { Book } from '../types/api';
import type { ReactElement } from 'react';

type CategoryShelfProps = {
  title: string;
  topicKey: string;
  books: Book[];
};

// вынеси за пределы компонента — чистая функция, хуки ей не нужны
function getSlotWidth(el: HTMLDivElement): number {
  const firstItem = el.querySelector<HTMLElement>('.category-shelf__item');
  if (!firstItem) return el.clientWidth;

  const style = getComputedStyle(el); // это CSSStyleDeclaration — набор всех вычисленных стилей элемента
  const gap = parseFloat(style.columnGap); // style.columnGap — строка вида "19px", parseFloat превращает её в число 19

  return firstItem.offsetWidth + gap; // ширина карточки (135) + зазор (19) = 154
}

export default function CategoryShelf({
  title,
  topicKey,
  books,
}: CategoryShelfProps): ReactElement | null {
  const dispatch = useAppDispatch();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(4);

  const checkScroll = (): void => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return (): void => window.removeEventListener('resize', checkScroll);
  }, [books, cardsPerView]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const updateCardsPerView = (): void => {
      const slotWidth = getSlotWidth(el);
      setCardsPerView(Math.max(1, Math.floor(el.clientWidth / slotWidth)));
    };

    updateCardsPerView();

    const observer = new ResizeObserver(updateCardsPerView);
    observer.observe(el);

    return (): void => observer.disconnect();
  }, [books]);

  const handleScroll = (direction: 'left' | 'right'): void => {
    const el = rowRef.current;
    if (!el) return;
    const scrollAmount = getSlotWidth(el) * cardsPerView;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleViewAll = (): void => {
    dispatch(setTopic(topicKey));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (books.length === 0) return null;

  const visibleBooks = books.slice(0, cardsPerView * 3);

  return (
    <section className='category-shelf'>
      <h2 className='category-shelf__title'>{title}</h2>

      <div className='category-shelf__row' ref={rowRef} onScroll={checkScroll}>
        {visibleBooks.map((book) => (
          <div key={book.id} className='category-shelf__item'>
            <BookCard book={book} />
          </div>
        ))}

        <div className='category-shelf__more-card'>
          <button
            type='button'
            className='category-shelf__more-btn'
            onClick={handleViewAll}
          >
            Смотреть все книги раздела «{title}».
          </button>
        </div>
      </div>

      <div className='category-shelf__controls'>
        <button
          type='button'
          className='category-shelf__arrow'
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label='Прокрутить влево'
        >
          ‹
        </button>
        <button
          type='button'
          className='category-shelf__arrow'
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label='Прокрутить вправо'
        >
          ›
        </button>
      </div>
    </section>
  );
}
