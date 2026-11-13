{
  /*
   src/components/Loader.tsx
*/
}
import type { ReactElement } from 'react';

export default function Loader(): ReactElement {
  return (
    <div className='loader' role='status' aria-label='Загрузка'>
      <div className='loader__sprite' />
      <span className='loader__text'>Загрузка...</span>
    </div>
  );
}
