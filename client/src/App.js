import './css/App.css';
import { fetchFlickr } from "./ApiService"
import useSearch from "./hooks/useSearch"
import { useEffect, useRef, useState, useCallback } from 'react';
import Card from './components/Card';

function App () {
  const sizeCode = 'm';

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
      const data = (await fetchFlickr('/interesting/', sizeCode)).photos;

      for (let i = 0; i < data.photo.length; i++) {
        const userRes = await fetchFlickr('/getUserUrl/', data.photo[i].owner);
        const authorUrl = userRes.user.url;
        data.photo[i] = { ...data.photo[i], authorUrl };
      }

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
      authorUrl={photo.authorUrl}
      author={photo.ownername}
      photoUrl={photo[`url_${sizeCode}`]}
      description={photo.description._content}
      tags={photo.tags}
    />
  }



  return (
    <main>
      <h1>Flickr Photo Stream</h1>
      <input className="search" placeholder="Search..." onChange={handleSearch} value={query} />
      <section className="cards-container">
        {!loading
          ? apiData.photo.map((photo, i) => {
            return i + 1 === foundPhotos.length
              ? <div key={photo.id + i} ref={lastCardRef}>
                {createCard(photo)}
              </div>
              : <div key={photo.id + i} >
                {createCard(photo)}
              </div>
          })
          : <p>Loading...</p>}
      </section>
    </main>
  );
}

export default App;
