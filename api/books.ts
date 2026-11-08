import type { APIResponse } from '../src/types/api';
import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelRequest = IncomingMessage & {
  query: Record<string, string | string[]>;
};

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { search, languages } = req.query;

  const params = new URLSearchParams();
  if (typeof search === 'string') params.append('search', search);
  if (typeof languages === 'string') params.append('languages', languages);

  try {
    const response = await fetch(`https://gutendex.com/books/?${params.toString()}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Gutendex ответил ошибкой' });
      return;
    }

    const data = (await response.json()) as APIResponse;

    // Кешируем ответ на CDN Vercel на 5 минут — если gutendex.com ляжет,
    // повторные запросы с теми же параметрами всё равно получат ответ из кеша
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json(data);
  } catch {
    res.status(502).json({ error: 'Не удалось связаться с Gutendex' });
  }
}
