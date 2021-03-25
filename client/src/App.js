import './css/App.css';
// import { fetchFlickr } from "./ApiService"
import { storeCache, assignCache } from './cache';
import useSearch from "./hooks/useSearch"
import { useEffect, useRef, useState, useCallback } from 'react';
import Card from './components/Card';
import Tag from './components/Tag';

function App () {
  const sizeCode = 'w';

  const [apiData, setApiData] = useState({ photos: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchPageNum, setSearchPageNum] = useState(1);
  const [feedPageNum, setFeedPageNum] = useState(1);
  const [filterTags, setFilterTags] = useState([]);
  const [photosToDisplay, setPhotosToDisplay] = useState([]);


  // useEffect(() => {
  //   const storedCache = localStorage.getItem('holidayExtras_cache');
  //   storedCache && assignCache(storedCache);

  //   window.addEventListener('beforeunload', storeCache);
  // }, []);

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

  useEffect(() => {
    console.log('PHOTOS::', feedPhotos)

    if (query.length) {
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

  }, [feedPhotos, filterTags, foundPhotos, query.length]);



  const observer = useRef();

  const lastCardRef = useCallback(lastCard => {
    if (loading) return;
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
  }, [loading, hasMore]);

  useEffect(() => {
    async function getData () {
      const data = (await fetchFlickr('/interesting/', pageNum)).photos;

      setApiData(data);
      setLoading(false);
    }
    getData();
  }, []);


  console.log(foundPhotos.map((p, i) => i + '   ' + p.title + '   ' + p.id))

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
      photoUrl={photo[`url_${sizeCode}`]}
      description={photo.description._content}
      filterHandler={addFilterTag}
      tags={photo.tags}
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
    console.log('CALLED FUNCTION: addFilterTag', tag)

    setFilterTags(currentTags => {
      if (!currentTags.includes(tag)) {
        return [...currentTags, tag];
      } else return currentTags;
    });
  }

  function removeFilterTag (tag) {
    console.log('CALLED FUNCTION: removeFilterTag', tag)
    setFilterTags(currentTags => {
      return currentTags.filter(t => t !== tag)

    });
  }

  return (
    <div className="app-container">
      <div className="title-panel">
        <h4>Konstantin Grachev</h4>
        <h1>Flickr Photo <br /> Stream</h1>
      </div>
      <section className="search-panel">
        <input className="search" placeholder="Search..." onChange={handleSearch} value={query} />
        <div className={`filter-tags-container ${filterTags.length && 'visible'}`}>
          {filterTags.map(tag => <Tag tagText={tag} filterHandler={() => removeFilterTag(tag)} key={tag} />)}
        </div>
      </section>
      <main>
        <section className="cards-container">
          {!loadingFeed || !loadingSearch
            ? renderCards(photosToDisplay)
              : <p>Loading...</p>}
        </section>
      </main>
    </div>
  );
}

export default App;
