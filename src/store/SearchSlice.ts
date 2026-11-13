//src/store/SearchSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Book, APIResponse } from '../types/api';
import type { RootState } from './index';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SearchState = {
  searchQuery: string;
  language: string;
  topic: string;
  books: Book[];
  // поле для открытой в модалке книги
  activeBook: Book | null;

  loadingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: SearchState = {
  searchQuery: '',
  language: 'en',
  topic: '',
  books: [],
  activeBook: null,
  loadingStatus: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk<APIResponse, void, { rejectValue: string }>(
  'search/fetchBooks',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const query = state.search.searchQuery;
      const lang = state.search.language;
      const topic = state.search.topic;

      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (lang) params.append('languages', lang);
      if (topic) params.append('topic', topic);

      const baseUrl = import.meta.env.VITE_GUTENDEX_URL ?? 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/books/?${params.toString()}`, {
        signal: thunkAPI.signal,
      });

      if (!response.ok) {
        return thunkAPI.rejectWithValue('Не удалось загрузить книги с сервера');
      }

      const data = (await response.json()) as APIResponse;
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      return thunkAPI.rejectWithValue('Сбой сети, сервер недоступен');
    }
  }
);

// 2. ДОБАВЛЯЕМ новый thunk для параллельной загрузки категорий на главную страницу
export const fetchMainPageSections = createAsyncThunk<
  { classics: Book[]; thrillers: Book[]; loveStories: Book[] },
  void,
  { rejectValue: string }
>('search/fetchMainPageSections', async (_, thunkAPI) => {
  try {
    const baseUrl = import.meta.env.VITE_GUTENDEX_URL ?? 'http://localhost:8000';

    // Запускаем 3 запроса параллельно, чтобы страница грузилась мгновенно
    const [classicsRes, thrillersRes, loveStoriesRes] = await Promise.all([
      fetch(`${baseUrl}/books/?topic=classic`),
      fetch(`${baseUrl}/books/?topic=thriller`),
      fetch(`${baseUrl}/books/?topic=love`),
    ]);

    if (!classicsRes.ok || !thrillersRes.ok || !loveStoriesRes.ok) {
      return thunkAPI.rejectWithValue('Не удалось загрузить подборки книг');
    }

    const classicsData = (await classicsRes.json()) as APIResponse;
    const thrillersData = (await thrillersRes.json()) as APIResponse;
    const loveStoriesData = (await loveStoriesRes.json()) as APIResponse;

    return {
      classics: classicsData.results,
      thrillers: thrillersData.results,
      loveStories: loveStoriesData.results,
    };
  } catch (_error) {
    return thunkAPI.rejectWithValue('Ошибка сети при загрузке подборок');
  }
});

export const bookSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
    },
    // Экшен для записи выбранной книги (для модального окна)
    setActiveBook: (state, action: PayloadAction<Book | null>) => {
      state.activeBook = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка вашего старого fetchBooks
      .addCase(fetchBooks.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded';
        state.books = action.payload.results;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loadingStatus = 'failed';
        state.error = action.payload ?? 'Произошла неизвестная ошибка';
      });
  },
});

export const { setSearchQuery, setLanguage, setTopic, setActiveBook } =
  bookSlice.actions;

export default bookSlice.reducer;
