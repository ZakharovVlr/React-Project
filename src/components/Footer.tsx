import { FaGithub } from 'react-icons/fa';

import type { ReactElement } from 'react';

export default function Footer(): ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__brand'>
          <span className='footer__logo'>ColBook</span>
          <p className='footer__tagline'>
            Открытая онлайн-библиотека классической и мировой литературы.
          </p>
        </div>

        <nav className='footer__links' aria-label='Навигация в подвале'>
          <a
            href='https://github.com/ZakharovVlr/React-Project.git'
            target='_blank'
            rel='noreferrer'
            className='footer__link'
          >
            <FaGithub size={18} />
          </a>
        </nav>

        <div className='footer__bottom'>
          <span>
            © {currentYear} ColBook. Все книги предоставлены в свободный доступ.
          </span>
          <span className='footer__version'>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
