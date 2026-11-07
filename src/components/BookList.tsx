{
  /*
   src/components/BookList.tsx 
*/
}
import { useAppSelector } from '../hooks/store';

import type { ReactElement } from 'react';

export default function BookList(): ReactElement | null {
  // 1. Вытаскиваем данные и статус из Redux
  const books = useAppSelector((state) => state.search.books);
  const loadingStatus = useAppSelector((state) => state.search.loadingStatus);

  // 2. Если сейчас идет загрузка или произошла ошибка, сам список ничего рендерить не должен
  // (так как лоадер и ошибку мы уже красиво обрабатываем на уровне App.tsx)
  if (loadingStatus !== 'succeeded') {
    return null;
  }

  // 3. Обработка ПУСТОГО ответа от сервера
  if (books.length === 0) {
    return (
      <div className='books-list__empty'>
        По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
      </div>
    );
  }

  // 4. Основной рендер списка в БЭМ-контейнере
  return (
    <div className='books-list'>
      {books.map((book) => (
        <div key={book.id} className='books-list__item'>
          {book.title} {/* Временно выводим только текст названия */}
        </div>
      ))}
    </div>
  );
}
