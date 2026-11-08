//src/store/SearchSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Book, APIResponse } from '../types/api';
import type { RootState } from './index';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SearchState = {
  searchQuery: string; // — поисковая строка, которую вводит пользователь
  language: string; // — выбранный язык для фильтрации книг
  books: Book[]; // — массив найденных книг, который мы отрисуем карточками
  loadingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: SearchState = {
  searchQuery: '',
  language: 'en',
  books: [],
  loadingStatus: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk<APIResponse, void, { rejectValue: string }>(
  'search/fetchBooks',
  async (_, thunkAPI) => {
    try {
      // Заглядываем в стейт. Пока стор не готов, временно используем 'as any'
      const state = thunkAPI.getState() as RootState;
      const query = state.search.searchQuery;
      const lang = state.search.language;

      // Строим параметры строки запроса
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (lang) params.append('languages', lang);

      // Делаем реальный fetch на базовый адрес Gutendex API
      const baseUrl = import.meta.env.VITE_GUTENDEX_URL ?? 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/books/?${params.toString()}`);

      if (!response.ok) {
        return thunkAPI.rejectWithValue('Не удалось загрузить книги с сервера');
      }

      // Приводим к типу, который мы спроектировали в api.ts
      const data = (await response.json()) as APIResponse;
      return data;
    } catch (_error) {
      return thunkAPI.rejectWithValue('Сбой сети, сервер недоступен');
    }
  }
);

export const bookSlice = createSlice({
  name: 'search', // Имя слайса
  initialState, // Наше начальное состояние
  reducers: {
    // 1. Синхронный экшен для строки ввода
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // 2. Синхронный экшен для смены фильтра языка
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Когда запрос начался
      .addCase(fetchBooks.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      // Когда запрос успешно завершился
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded';
        // Записываем массив из ключа results ответа сервера
        state.books = action.payload.results;
      })
      // Когда запрос упал
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.payload ?? 'Произошла неизвестная ошибка';
      });
  },
});

// Экспортируем "кнопки" для компонентов
export const { setSearchQuery, setLanguage } = bookSlice.actions;

// Экспортируем редюсер по умолчанию для стора
export default bookSlice.reducer;
