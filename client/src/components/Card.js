import React, { useEffect, useRef } from 'react';
import '../css/Card.css';
import Tag from './Tag';


export default function Card ({ title, photoUrl, author, authorUrl, description, tags, filterHandler, filterTags }) {


  const descriptionRef = useRef();

  useEffect(() => {
    descriptionRef.current.innerHTML = description;
  }, []);

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
          <div className="description-container" ref={descriptionRef} />
          <ul className="tags-list">{tags.split(' ').map((tag, i) => {
            return <Tag
              tagText={tag}
              filterHandler={filterHandler}
              isInCard={true}
              tagIsSelected={filterTags.length && filterTags.includes(tag)} />
          })}
            <div className="shadow-box" />
          </ul>
        </figcaption>
      </figure>
    </div>
  )
}
