import React, { useEffect } from 'react';
import '../css/Card.css';


export default function Card ({ title, photoUrl, author, authorUrl, description, tags }) {

  useEffect(() => {

  }, []);

  function renderTags () {
    return tags.split(' ').map((tag, i) => {
      return <li key={tag+i}><div className="tag-text">{ tag}</div><button >+</button></li>
    })
  }

  return (
    <div className="card-container">
      <figure>
        <img src={photoUrl} alt={title} />
        <figcaption>
          <div className="details">
            <a href={photoUrl} className="title">{title}</a>
            <div className="author">
              <i>by <a href={authorUrl} >{author}</a></i>
            </div>
          </div>
          <p className="description">
            {/* {description} */}
          </p>
          <ul className="tags-list">{renderTags()}
            <div className="shadow-box"></div>
          </ul>
        </figcaption>
      </figure>
    </div>
  )
}
