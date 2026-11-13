import { useAppDispatch, useAppSelector } from '../hooks/store';
import { setTopic } from '../store/SearchSlice';

import type { ReactElement } from 'react';

// Словарь для перевода английского topic в красивое русское название
const TOPIC_LABELS: Record<string, string> = {
  classic: 'Классика',
  health: 'Здоровье',
  business: 'Бизнес',
  detective: 'Детективы',
  'science fiction': 'Фантастика',
  thriller: 'Триллеры и хорроры',
  romance: 'Романтика',
  history: 'Исторический роман',
  adventure: 'Приключения',
  poetry: 'Поэзия и драма',
  psychology: 'Психология',
  children: 'Детям',
  art: 'Искусство и культура',
  science: 'Наука и технологии',
  religion: 'Религия и мифология',
  horror: 'Триллеры и хорроры',
  mystery: 'Детективы',
  'historical fiction': 'Исторический роман',
  mythology: 'Религия и мифология',
};

export default function CategoryHeader(): ReactElement | null {
  const dispatch = useAppDispatch();
  const topic = useAppSelector((state) => state.search.topic);

  if (!topic) {
    return null;
  }

  const label = TOPIC_LABELS[topic] ?? topic;

  return (
    <section className='category-showcase'>
      <nav className='category-showcase__breadcrumbs' aria-label='Навигация'>
        <button
          type='button'
          className='category-showcase__back-btn'
          onClick={() => dispatch(setTopic(''))}
        >
          Главная
        </button>
        <span className='category-showcase__separator'>/</span>
        <span className='category-showcase__current'>{label}</span>
      </nav>

      <h1 className='category-showcase__title'>{label}</h1>
    </section>
  );
}
