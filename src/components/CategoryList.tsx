import { useAppDispatch, useAppSelector } from '../hooks/store';
import { setTopic, fetchBooks } from '../store/SearchSlice';

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
  { label: 'Исторический роман', topic: 'historical fiction' },
  { label: 'Приключения', topic: 'adventure' },
  { label: 'Поэзия и драма', topic: 'poetry' },
  { label: 'Психология', topic: 'psychology' },
  { label: 'Детям', topic: 'children' },
  { label: 'Искусство и культура', topic: 'art' },
  { label: 'Наука и технологии', topic: 'science' },
  { label: 'Религия и мифология', topic: 'mythology' },
];

export default function CategoryList(): ReactElement {
  const dispatch = useAppDispatch();
  const activeTopic = useAppSelector((state) => state.search.topic);

  const handleClick = (topic: string): void => {
    // Повторный клик по уже выбранной категории снимает фильтр
    dispatch(setTopic(activeTopic === topic ? '' : topic));
    void dispatch(fetchBooks());
  };

  return (
    <section className='category-list'>
      <h2 className='category-list__title'>Категории</h2>
      <div className='category-list__items'>
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
    </section>
  );
}
