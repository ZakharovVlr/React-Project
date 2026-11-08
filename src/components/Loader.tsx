import type { ReactElement } from 'react';

export default function Loader(): ReactElement {
  return (
    <div className='loader' role='status' aria-label='Загрузка'>
      <div className='loader__spinner' />
    </div>
  );
}
