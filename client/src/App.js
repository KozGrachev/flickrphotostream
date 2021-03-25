import './css/App.css';
// import { fetchFlickr } from "./ApiService"
import {storeCache, assignCache} from './cache';
import useSearch from "./hooks/useSearch"
import useFeed from "./hooks/useFeed"
import { useEffect, useRef, useState, useCallback } from 'react';
import Card from './components/Card';


function App () {
  const sizeCode = 'w';

  const [query, setQuery] = useState('');
  const [searchPageNum, setSearchPageNum] = useState(1);
  const [feedPageNum, setFeedPageNum] = useState(1);

  useEffect(() => {
    const storedCache = localStorage.getItem('holidayExtras_cache');
    storedCache && assignCache(storedCache);

    window.addEventListener('beforeunload', storeCache);
  }, []);

  const {
    foundPhotos,
    loading: loadingSearch,
    error: searchError,
    hasMore: searchHasMore
  } = useSearch(searchPageNum, query);
  const {
    foundPhotos: feedPhotos = { photos: [] },
    loading: loadingFeed,
    error: feedError,
    hasMore: feedHasMore,
  } = useFeed('interesting', feedPageNum);

  const observer = useRef();

  const lastCardRef = useCallback(lastCard => {
    if (loadingSearch || loadingFeed) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting && (searchHasMore || feedHasMore)) {
        query ? setSearchPageNum(pn => {
          console.log("NEXT PAGE ::: ", pn + 1);
          return pn + 1
        })
        : setFeedPageNum(pn => pn + 1);
      }
    });

    if (lastCard) observer.current.observe(lastCard);

  }, [loadingSearch, loadingFeed, searchHasMore, feedHasMore, query]);

  console.log(foundPhotos.map((p, i) => i + '   ' + p.title + '   ' + p.id))

  function handleSearch (event) {
    setQuery(event.target.value);
    setSearchPageNum(1);
  }

  function createCard (photo) {
    return <Card
      title={photo.title}
      authorUrl={`https://www.flickr.com/people/${photo.owner}/`}
      author={photo.ownername}
      photoUrl={photo[`url_${sizeCode}`]}
      description={photo.description._content}
      tags={photo.tags}
    />
  }

  function renderCards (coll) {
    return coll.map((photo, i) => {
      return i + 1 === coll.length
        ? <div key={photo.id + i} ref={lastCardRef}>
          **** LAST ONE ****
          {createCard(photo)}
        </div>
        : <div key={photo.id + i} >
          {createCard(photo)}
        </div>
    })
  }

  return (
    <div className="app-container">
      <section className="search-panel">
        <input className="search" placeholder="Search..." onChange={handleSearch} value={query} />
        <div className="filter-tags-container"></div>
      </section>
      <main>
        <div className="title-panel">
          <h4>Konstantin Grachev</h4>
          <h1>Flickr Photo <br /> Stream</h1>
        </div>
        <section className="cards-container">
          {!loadingFeed && query.length === 0
            ? renderCards(feedPhotos)
            : query.length > 0
            ? renderCards(foundPhotos)
            : <p>Loading...</p>}
        </section>
      </main>
    </div>
  );
}

export default App;
