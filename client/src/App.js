import './css/App.css';
import useSearch from "./hooks/useSearch"
import useFeed from "./hooks/useFeed"
import { useEffect, useRef, useState, useCallback } from 'react';
import Card from './components/Card';
import Tag from './components/Tag';
import Spinner from './components/Spinner'


function App () {
  const photoSizeCodes = {
    s: 'n',
    m: 'z',
    l: 'l',
    xl: 'h',
  }

  const [query, setQuery] = useState('');
  const [searchPageNum, setSearchPageNum] = useState(1);
  const [feedPageNum, setFeedPageNum] = useState(1);
  const [filterTags, setFilterTags] = useState([]);
  const [photosToDisplay, setPhotosToDisplay] = useState([]);

  useEffect(() => {
    if (filterTags.length === 0) {
      setFeedPageNum(1);
    }
  }, [filterTags])

  const {
    foundPhotos,
    loading: loadingSearch,
    error: searchError, //! add error-handling
    hasMore: searchHasMore
  } = useSearch(searchPageNum, query);
  const {
    foundPhotos: feedPhotos = { photos: [] },
    loading: loadingFeed,
    error: feedError, //! add error-handling
    hasMore: feedHasMore,
  } = useFeed('interesting', feedPageNum, filterTags, );


  useEffect(() => {
    if (query.length > 2) {
      if (filterTags.length) {
        setPhotosToDisplay(filterByTags(foundPhotos));
      } else setPhotosToDisplay(foundPhotos);
    } else {
      if (filterTags.length) {
        setPhotosToDisplay(filterByTags(feedPhotos));
      } else setPhotosToDisplay(feedPhotos);
    }

    function filterByTags (coll) {
      let newColl = coll;

      for (let tag of filterTags) {
        newColl = newColl.filter(photo => {
          return photo.tags.split(' ').includes(tag);
        })
      }

      return newColl;
    }

  }, [feedPhotos, filterTags, foundPhotos, query]);

  const cardsContainerRef = useRef();

  useEffect(() => {
    document.querySelector('html').scrollTop =240;
    cardsContainerRef.current.scrollLeft = 0;
  }, [filterTags, query])

  const observer = useRef();

  const lastCardRef = useCallback(lastCard => {

    if ((query && loadingSearch) || (!query && loadingFeed)) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting) {

        if (query && searchHasMore) setSearchPageNum(pn => pn + 1)

        if (!query && feedHasMore) setFeedPageNum(pn => pn + 1);
      }
    });

    if (lastCard) observer.current.observe(lastCard);

  }, [loadingSearch, loadingFeed, searchHasMore, feedHasMore, query]);


  function handleSearch (event) {
    setQuery(event.target.value);
    setSearchPageNum(1);
    setFilterTags([]);
  }

  function createCard (photo) {
    return <Card
      title={photo.title}
      authorUrl={`https://www.flickr.com/people/${photo.owner}/`}
      author={photo.ownername}
      photoUrls={{
        s: photo[`url_${photoSizeCodes.s}`],
        m: photo[`url_${photoSizeCodes.m}`],
        l: photo[`url_${photoSizeCodes.l}`],
        xl: photo[`url_${photoSizeCodes.xl}`],
      }}
      description={photo.description._content}
      filterHandler={addFilterTag}
      searchHandler={searchByTag}
      clearFilterTags={clearFilterTags}
      tags={photo.tags}
      filterTags={filterTags}
    />
  }

  function renderCards (coll) {
    return coll.map((photo, i) => {
      return i + 1 === coll.length
        ? <div key={photo.id + i} ref={lastCardRef}>
          {createCard(photo)}
        </div>
        : <div key={photo.id + i} >
          {createCard(photo)}
        </div>
    })
  }

  function addFilterTag (tag) {
    setFilterTags(currentTags => {
      if (!currentTags.includes(tag)) {
        return [...currentTags, tag];
      } else return currentTags;
    });
  }

  function removeFilterTag (tag) {
    setFilterTags(currentTags => {
      return currentTags.filter(t => t !== tag)
    });
  }

  function clearFilterTags () {
    setFilterTags([]);
  }

  function searchByTag (tag) {
    setQuery(tag);
  }
  return (
    <div className="app-container">
      <section className="top">
        <div className="title-panel">
          <h1>Flickr</h1> <h1>Photo Stream</h1>
        </div>
      </section>
      <div className="search-panel">
        <input className="search" placeholder="Search..." onChange={handleSearch} value={query} />
        <div className={`filter-tags-container ${filterTags.length ? 'visible' : ''}`}>
          {filterTags.map(tag => <Tag
            tagText={tag}
            filterHandler={() => removeFilterTag(tag)}
            searchHandler={searchByTag}
            key={tag} />)}
        </div>
      </div>
      <main ref={cardsContainerRef} className={`${photosToDisplay.length ? "cards-container" : null}`}>
        {photosToDisplay.length ? renderCards(photosToDisplay) : <Spinner />}

      </main>
    </div>
  );
}

export default App;
