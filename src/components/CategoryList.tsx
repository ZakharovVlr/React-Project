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
  { label: 'Романтика', topic: 'romance' },
  { label: 'Сказки', topic: 'fairy tales' },
  { label: 'Исторический роман', topic: 'historical fiction' },
  { label: 'Приключения', topic: 'adventure' },
  { label: 'Поэзия и драма', topic: 'poetry' },
  { label: 'Психология', topic: 'psychology' },
  { label: 'Детям', topic: 'children' },
  { label: 'Искусство и культура', topic: 'art' },
  { label: 'Триллеры и хорроры', topic: 'horror' },
  { label: 'Политика и право', topic: 'politics' },
  { label: 'Наука и технологии', topic: 'science' },
  { label: 'Мифология', topic: 'mythology' },
  { label: 'Религия', topic: 'religion' },
  { label: 'Пьесы', topic: 'drama' },
  { label: 'Юмор и сатира', topic: 'humor' },
  { label: 'Биографии и мемуары', topic: 'biography' },
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

  return (
    <section className='category-list'>
      <h2 className='category-list__title'>Категории</h2>

      {/* Рендерим весь список, а CSS сам обрезает всё после 2-й строки */}
      <div
        className={`category-list__items${
          isExpanded ? ' category-list__items--expanded' : ''
        }`}
      >
        {categories.map((category) => (
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
      </div>

      {/* Единая кнопка раскрытия/сворачивания прямо под сеткой тегов */}
      <button
        type='button'
        className='category-list__toggle'
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? 'Свернуть' : 'Все категории >'}
      </button>
    </section>
  );
}
