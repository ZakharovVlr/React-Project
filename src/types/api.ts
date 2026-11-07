//src/types/api.ts
export type Person = {
  name: string;
  birth_year: number | null;
  death_year: number | null;
};

export type Book = {
  id: number;
  title: string;
  authors: Person[];
  bookshelves: string[];
  languages: string[];
  download_count: number;
  // Словарь Record: ключ — формат (mp3, wav), значение — URL-ссылка
  formats: Record<string, string>;
};

export type APIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
};
