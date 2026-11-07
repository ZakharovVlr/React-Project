//src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

// Импортируем редюсер (название при импорте по умолчанию выбираем сами)
import searchReducer from './SearchSlice';

export const store = configureStore({
  reducer: {
    // Регистрируем кусочек стейта под определенным ключом
    search: searchReducer,
  },
});

// Экспортируем типы для хуков Яндекса
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
