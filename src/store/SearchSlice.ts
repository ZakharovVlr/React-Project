//src/store/SearchSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Book, APIResponse } from '../types/api';
import type { RootState } from './index';
import type { PayloadAction } from '@reduxjs/toolkit';

export type MainSectionsData = {
  classics: Book[];
  thrillers: Book[];
  loveStories: Book[];
  cookery: Book[];
};

export type SearchState = {
  searchQuery: string;
  language: string;
  topic: string;
  books: Book[];
  // поле для открытой в модалке книги
  activeBook: Book | null;
  loadingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  cache: Record<string, { results: Book[]; next: string | null; count: number }>;
  nextUrl: string | null;
  isLoadingMore: boolean;
  totalCount: number;
  mainSections: MainSectionsData | null;
  mainSectionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  mainSectionsError: string | null;
  heroBooks: Book[];
  heroBooksStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  activeCollectionId: string | null;
};

const initialState: SearchState = {
  searchQuery: '',
  language: '',
  topic: '',
  books: [],
  activeBook: null,
  loadingStatus: 'idle',
  error: null,
  cache: {},
  nextUrl: null,
  isLoadingMore: false,
  totalCount: 0,
  mainSections: null,
  mainSectionsStatus: 'idle',
  mainSectionsError: null,
  heroBooks: [],
  heroBooksStatus: 'idle',
  activeCollectionId: null,
};

export const fetchBooks = createAsyncThunk<
  APIResponse & { cacheKey: string; fromCache: boolean },
  void,
  { rejectValue: string }
>('search/fetchBooks', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const query = state.search.searchQuery;
  const lang = state.search.language;
  const topic = state.search.topic;

  const cacheKey = `${query}|${lang}|${topic}`;
  const cached = state.search.cache[cacheKey];

  if (cached) {
    // Данные уже есть — отдаём их без похода на сервер
    return {
      count: cached.count,
      next: cached.next,
      previous: null,
      results: cached.results,
      cacheKey,
      fromCache: true,
    };
  }

  try {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (lang) params.append('languages', lang);
    if (topic) params.append('topic', topic);

    const baseUrl =
      import.meta.env.VITE_GUTENDEX_URL ?? 'https://gutendex-tqvo.onrender.com';
    const response = await fetch(`${baseUrl}/books/?${params.toString()}`, {
      signal: thunkAPI.signal,
    });

    if (!response.ok) {
      return thunkAPI.rejectWithValue('Не удалось загрузить книги с сервера');
    }

    const data = (await response.json()) as APIResponse;
    return { ...data, cacheKey, fromCache: false };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    return thunkAPI.rejectWithValue('Сбой сети, сервер недоступен');
  }
});

export const fetchHeroBooks = createAsyncThunk<
  Book[],
  number[], // Принимаем массив ID книг из вашего конфига EDITORIAL_HERO_DATA.bookIds
  { rejectValue: string }
>('search/fetchHeroBooks', async (ids, thunkAPI) => {
  // Защита от повторного запроса, если книги уже есть возвращаем их
  const state = thunkAPI.getState() as RootState;
  if (state.search.heroBooks.length > 0) {
    return state.search.heroBooks;
  }
  // Внутри try формируем запрос
  // передать { signal: thunkAPI.signal } и проверить !response.ok.
  try {
    const baseUrl =
      import.meta.env.VITE_GUTENDEX_URL ?? 'https://gutendex-tqvo.onrender.com';
    const response = await fetch(`${baseUrl}/books/?ids=${ids.join(',')}`, {
      signal: thunkAPI.signal,
    });

    if (!response.ok) {
      return thunkAPI.rejectWithValue('Не удалось загрузить книги для главного блока');
    }
    // Верните data.results (предварительно типизировав ответ как APIResponse).
    const data = (await response.json()) as APIResponse;
    const sortedBooks = [...data.results].sort(
      (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)
    );
    return sortedBooks;
    // TODO 4: В catch обработайте AbortError так же, как в fetchMainPageSections.
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    return thunkAPI.rejectWithValue('Ошибка сети при загрузке подборок');
  }
});

export const fetchMoreBooks = createAsyncThunk<
  APIResponse,
  string, // Тип аргумента, который мы передаём при вызове (это ссылка nextUrl)
  { rejectValue: string }
>('search/fetchMoreBooks', async (nextUrl, thunkAPI) => {
  try {
    // Защита от Mixed Content: меняем http:// на https://, если сервер вернул http
    const secureUrl = nextUrl.replace(/^http:\/\//i, 'https://');

    const response = await fetch(secureUrl);

    if (!response.ok) {
      return thunkAPI.rejectWithValue('Ошибка загрузки');
    }

    const data = (await response.json()) as APIResponse;
    return data;
  } catch (_error) {
    return thunkAPI.rejectWithValue('Сбой сети при подгрузке книг');
  }
});

export const fetchMainPageSections = createAsyncThunk<
  MainSectionsData,
  void,
  { rejectValue: string }
>('search/fetchMainPageSections', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  if (state.search.mainSections) {
    return state.search.mainSections;
  }

  try {
    const baseUrl =
      import.meta.env.VITE_GUTENDEX_URL ?? 'https://gutendex-tqvo.onrender.com';

    const [classicsRes, thrillersRes, loveStoriesRes, cookeryRes] = await Promise.all([
      fetch(`${baseUrl}/books/?topic=classic`, { signal: thunkAPI.signal }),
      fetch(`${baseUrl}/books/?topic=horror`, { signal: thunkAPI.signal }),
      fetch(`${baseUrl}/books/?topic=romance`, { signal: thunkAPI.signal }),
      fetch(`${baseUrl}/books/?topic=cooking`, { signal: thunkAPI.signal }),
    ]);

    if (!classicsRes.ok || !thrillersRes.ok || !loveStoriesRes.ok || !cookeryRes.ok) {
      return thunkAPI.rejectWithValue('Не удалось загрузить подборки книг');
    }

    const classicsData = (await classicsRes.json()) as APIResponse;
    const thrillersData = (await thrillersRes.json()) as APIResponse;
    const loveStoriesData = (await loveStoriesRes.json()) as APIResponse;
    const cookeryData = (await cookeryRes.json()) as APIResponse;

    return {
      classics: classicsData.results,
      thrillers: thrillersData.results,
      loveStories: loveStoriesData.results,
      cookery: cookeryData.results,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
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
    setActiveCollectionId: (state, action: PayloadAction<string | null>) => {
      state.activeCollectionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded';
        state.books = action.payload.results;
        state.nextUrl = action.payload.next; // Сохраняем ссылку на 2-ю страницу
        state.totalCount = action.payload.count;

        if (!action.payload.fromCache) {
          state.cache[action.payload.cacheKey] = {
            results: action.payload.results,
            next: action.payload.next,
            count: action.payload.count,
          };
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loadingStatus = 'failed';
        state.error = action.payload ?? 'Произошла неизвестная ошибка';
      })

      // Обработка кнопки «Показать еще»
      .addCase(fetchMoreBooks.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreBooks.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.books = [...state.books, ...action.payload.results];
        state.nextUrl = action.payload.next;

        const cacheKey = `${state.searchQuery}|${state.language}|${state.topic}`;
        if (state.cache[cacheKey]) {
          state.cache[cacheKey] = {
            results: state.books,
            next: state.nextUrl,
            count: state.totalCount,
          };
        }
      })
      .addCase(fetchMoreBooks.rejected, (state) => {
        state.isLoadingMore = false;
      })

      // Обработка полок на главной странице
      .addCase(fetchMainPageSections.pending, (state) => {
        state.mainSectionsStatus = 'loading';
        state.mainSectionsError = null;
      })
      .addCase(fetchMainPageSections.fulfilled, (state, action) => {
        state.mainSectionsStatus = 'succeeded';
        state.mainSections = action.payload;
      })
      .addCase(fetchMainPageSections.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.mainSectionsStatus = 'failed';
        state.mainSectionsError = action.payload ?? 'Ошибка загрузки подборок';
      })
      // Обработка книг для главного редакторского блока
      .addCase(fetchHeroBooks.pending, (state) => {
        state.heroBooksStatus = 'loading';
      })
      .addCase(fetchHeroBooks.fulfilled, (state, action) => {
        state.heroBooks = action.payload;
      })
      .addCase(fetchHeroBooks.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.heroBooksStatus = 'failed';
      });
  },
});

export const {
  setSearchQuery,
  setLanguage,
  setTopic,
  setActiveBook,
  setActiveCollectionId,
} = bookSlice.actions;

export default bookSlice.reducer;
