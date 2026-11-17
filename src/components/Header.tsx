{
  /*
   src/components/Header.tsx
*/
}
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import type { ReactElement } from 'react';

export default function Header(): ReactElement {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <header className='header'>
      <div className='header__logo'>ColBook</div>
      <button
        type='button'
        className='header__burger'
        aria-label='Меню'
        onClick={() => {
          setMenuOpen(!isMenuOpen);
        }}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`header__menu ${isMenuOpen ? 'header__menu--open' : ''}`}>
        <div className='header__menu-top'>
          <button
            type='button'
            className='header__close-button'
            aria-label='Закрыть меню'
            onClick={() => setMenuOpen(false)}
          >
            <span />
            <span />
          </button>
        </div>
        <ul className='header__menu-list'>
          <li className='header__menu-item'>О проекте</li>
          <li className='header__menu-item'>Сообщить об ошибке</li>
          <li className='header__menu-item'>Тема</li>
          <li className='header__menu-item'>Язык</li>
          <li className='header__menu-item'>
            <a
              href='https://github.com/ZakharovVlr/React-Project.git'
              target='_blank'
              rel='noreferrer'
            >
              <FaGithub size={24} />
            </a>
          </li>
          <li className='header__menu-item'>v1.0.0</li>
        </ul>
      </nav>
      <div
        className={`header__overlay ${isMenuOpen ? 'header__overlay--open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
