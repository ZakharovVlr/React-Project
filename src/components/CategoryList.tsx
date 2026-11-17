{
  /*
   src/components/CategoryList.tsx
*/
}
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/store';
import { setTopic } from '../store/SearchSlice';

import type { ReactElement } from 'react';

// Каждая категория: что видит пользователь (label) и что реально уходит
// в запрос к Gutendex (topic) — каталог на английском, поэтому подписи
// переведены, а topic оставлен как ключевое слово для поиска по bookshelves/subjects
const categories: { label: string; topic: string }[] = [
  { label: 'Классика', topic: 'classic' },
  { label: 'Здоровье', topic: 'health' },
  { label: 'Бизнес', topic: 'business' },
  { label: 'Детективы', topic: 'mystery' },
  { label: 'Фантастика', topic: 'science fiction' },
  { label: 'Триллеры и хорроры', topic: 'horror' },
  { label: 'Романтика', topic: 'romance' },
  { label: 'Сказки', topic: 'fairy tales' },
  { label: 'Исторический роман', topic: 'historical fiction' },
  { label: 'Приключения', topic: 'adventure' },
  { label: 'Поэзия и драма', topic: 'poetry' },
  { label: 'Психология', topic: 'psychology' },
  { label: 'Детям', topic: 'children' },
  { label: 'Искусство и культура', topic: 'art' },
  { label: 'Наука и технологии', topic: 'science' },
  { label: 'Религия и мифология', topic: 'mythology' },
  { label: 'Юмор и сатира', topic: 'humor' },
  { label: 'Пьесы', topic: 'drama' },
  { label: 'Биографии и мемуары', topic: 'biography' },
  { label: 'Политика и право', topic: 'politics' },
  { label: 'Кулинария', topic: 'cookery' },
  { label: 'Путешествия', topic: 'travel' },
];

export default function CategoryList(): ReactElement {
  const dispatch = useAppDispatch();
  const activeTopic = useAppSelector((state) => state.search.topic);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (topic: string): void => {
    dispatch(setTopic(activeTopic === topic ? '' : topic));
  };

  // На десктопе в свернутом виде показываем 14 категорий (ровно 2 строки)
  const visibleCategories = isExpanded ? categories : categories.slice(0, 14);

  return (
    <section className='category-list'>
      <h2 className='category-list__title'>Категории</h2>
      <div
        className={`category-list__items${
          isExpanded ? ' category-list__items--expanded' : ''
        }`}
      >
        {visibleCategories.map((category) => (
          <button
            key={category.topic}
            type='button'
            className={`category-list__item${
              activeTopic === category.topic ? ' category-list__item--active' : ''
            }`}
            onClick={() => handleClick(category.topic)}
          >
            {category.label}
          </button>
        ))}

        {/* На десктопе кнопка стоит прямо в конце 2-й строки */}
        <button
          type='button'
          className='category-list__toggle category-list__toggle--desktop'
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'Свернуть' : 'Все категории >'}
        </button>
      </div>

      {/* На мобильном кнопка выводится под обрезанным списком из 2 строк */}
      <button
        type='button'
        className='category-list__toggle category-list__toggle--mobile'
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? 'Свернуть' : 'Все категории >'}
      </button>
    </section>
  );
}
