{
  /*
   src/components/Header.tsx
*/
}
import { useEffect, useState } from 'react';
import { FaGithub, FaInfoCircle, FaBug, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';

import type { ReactElement } from 'react';

export default function Header(): ReactElement {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('colbook-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('colbook-theme', theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
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
          <li className='header__menu-item'>
            <FaInfoCircle size={24} />
            <span>О проекте</span>
          </li>
          <li className='header__menu-item'>
            <FaBug size={24} />
            <span>Сообщить об ошибке</span>
          </li>
          <li
            className='header__menu-item'
            onClick={toggleTheme}
            role='button'
            tabIndex={0}
          >
            {theme === 'dark' ? <FaSun size={24} /> : <FaMoon size={24} />}
            <span>{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
          </li>

          <li className='header__menu-item'>
            <FaGlobe size={24} />
            <span>Язык</span>
          </li>
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
