import React, { useEffect } from 'react';
import '../css/Card.css';
import Tag from './Tag';


export default function Card ({ title, photoUrl, author, authorUrl, description, tags }) {

  useEffect(() => {

  }, []);

  function renderTags () {
    return tags.split(' ').map((tag, i) => {
      return <Tag tagText={tag}/>
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
          <div className="description-container">
            {/* <p className="description"> */}
              {description}
            {/* </p> */}
          </div>
          <ul className="tags-list">{renderTags()}
            <div className="shadow-box" />
          </ul>
        </figcaption>
      </figure>
    </div>
  )
}
