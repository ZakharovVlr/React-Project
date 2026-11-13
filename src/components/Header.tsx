{
  /*
   src/components/Header.tsx
*/
}
import type { ReactElement } from 'react';

export default function Header(): ReactElement {
  return (
    <header className='header'>
      <div className='header__logo'>ColBook</div>
      <button type='button' className='header__burger' aria-label='Меню'>
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
