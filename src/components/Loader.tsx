{
  /*
   src/components/Loader.tsx
*/
}
import bookSprite from '../assets/images/book-loader.png';

import type { ReactElement } from 'react';

export default function Loader(): ReactElement {
  return (
    <div className='loader' role='status' aria-label='Загрузка'>
      <div
        className='loader__sprite'
        style={{ backgroundImage: `url(${bookSprite})` }}
      />
      <span className='loader__text'>Загрузка...</span>
    </div>
  );
}
