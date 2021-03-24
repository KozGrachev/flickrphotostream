import './css/App.css';
import { fetchFlickr } from "./ApiService"
import useSearch from "./hooks/useSearch"
import { useEffect, useRef, useState, useCallback } from 'react';
import Card from './components/Card';

function App () {
  const sizeCode = 'w';

  const [apiData, setApiData] = useState({ photos: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const { foundPhotos, searching, error, hasMore } = useSearch(query, pageNum);
  const observer = useRef();

  const lastCardRef = useCallback(lastCard => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNum(pn => pn + 1);
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

  function handleSearch (e) {
    setQuery(e.target.value);
    setPageNum(1);

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
          {!loading && query.length === 0
            ? renderCards(apiData.photo)
            : !loading && query.length > 0
            ? renderCards(foundPhotos)
            : <p>Loading...</p>}
        </section>
      </main>
    </div>
  );
}

export default App;
