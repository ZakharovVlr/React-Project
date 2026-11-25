// src/components/HomeShelves.tsx
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/store';
import { fetchMainPageSections } from '../store/SearchSlice';
import CategoryShelf from './CategoryShelf';
import Loader from './Loader';

import type { ReactElement } from 'react';

export default function HomeShelves(): ReactElement | null {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state) => state.search.mainSections);
  const status = useAppSelector((state) => state.search.mainSectionsStatus);
  const error = useAppSelector((state) => state.search.mainSectionsError);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchMainPageSections());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return <div className='error-message'>{error}</div>;
  }

  if (!sections) {
    return null;
  }

  return (
    <div className='home-shelves'>
      <CategoryShelf title='Классика' topicKey='classic' books={sections.classics} />
      <CategoryShelf
        title='Триллеры и хорроры'
        topicKey='horror'
        books={sections.thrillers}
      />
      <CategoryShelf title='Романтика' topicKey='romance' books={sections.loveStories} />
      <CategoryShelf title='Кулинария' topicKey='cooking' books={sections.cookery} />
    </div>
  );
}
