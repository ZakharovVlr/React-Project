import { useEffect } from 'react';

import { EDITORIAL_COLLECTIONS } from '../constants/editorialHero';
import { useAppDispatch } from '../hooks/store';
import { fetchHeroBooks, setActiveCollectionId } from '../store/SearchSlice';

import type { ReactElement } from 'react';

export default function EditorialHero(): ReactElement {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const allIds = Array.from(
      new Set(EDITORIAL_COLLECTIONS.flatMap((collection) => collection.bookIds))
    );

    const promise = dispatch(fetchHeroBooks(allIds));
    return (): void => {
      promise.abort();
    };
  }, [dispatch]);

  const handleOpenCollection = (collectionId: string): void => {
    dispatch(setActiveCollectionId(collectionId));
  };

  return (
    <section className='editorial-hero' aria-label='Выбор редакции'>
      <div className='editorial-hero__grid'>
        {EDITORIAL_COLLECTIONS.map((collection) => (
          <article
            key={collection.id}
            className={`editorial-card editorial-card_size_${collection.size} editorial-card_accent_${collection.accentTheme}`}
            onClick={() => handleOpenCollection(collection.id)}
          >
            {collection.coverImage && (
              <div className='editorial-card__media'>
                <img
                  className='editorial-card__image'
                  src={collection.coverImage}
                  alt={collection.title}
                  loading='lazy'
                />
                {collection.imageCredit && (
                  <span className='editorial-card__credit'>
                    {collection.imageCredit}
                  </span>
                )}
              </div>
            )}

            <div className='editorial-card__content'>
              <span className='editorial-card__kicker'>{collection.kicker}</span>
              <h2 className='editorial-card__title'>{collection.title}</h2>
              <p className='editorial-card__lead'>{collection.lead}</p>
              <span className='editorial-card__meta'>
                {collection.bookIds.length} книг в подборке →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
