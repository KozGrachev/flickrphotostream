import './css/App.css';
import { fetchFlickr } from "./ApiService"
import { useEffect, useState } from 'react';
import Card from './components/Card';

function App () {

  const [apiData, setApiData] = useState({ photos: [] });
  const [loading, setLoading] = useState(true);
  const sizeCode = 's';

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

  async function getUserUrl (photosArr) {
  }

  function renderCards () {

    console.log("RENDERING CARDS:   ", apiData); //!! REMOVE
    const photos = apiData.photo;

    return photos.map((photo, i) => {
      console.log(photo[`url_${sizeCode}`]);
      return <Card
        title={photo.title}
        authorUrl={photo.authorUrl}
        author={photo.ownername}
        photoUrl={photo[`url_${sizeCode}`]}
        description={photo.description._content}
        tags = {photo.tags}
        key={photo.id} />
    })
  }




  return (
    <main>

      {/* <div className="test-container">
        <img className="test-photo" src="https://live.staticflickr.com/65535/51059788722_8610964044_w.jpg" alt="" />
      </div> */}
      <h1>Flickr Photo Stream</h1>
      <input className="search" placeholder="Search..." />
      <section className="cards-container">
        {!loading
          ? renderCards()
          : <p>Loading...</p>}
      </section>
    </main>
  );
}

export default App;
