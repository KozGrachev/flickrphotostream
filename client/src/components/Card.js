import React, { useEffect, useRef, useState } from 'react';
import '../css/Card.css';
import Tag from './Tag';


export default function Card ({ title, photoUrls, author, authorUrl, description, tags, filterHandler, filterTags }) {

  const [isFocused, setIsFocused] = useState(false)
  const descriptionRef = useRef();

  useEffect(() => {
    descriptionRef.current.innerHTML = description;
  }, []);

  console.log(photoUrls);

  return (
    <div className={`card-container ${isFocused ? 'focused' : 'unfocused'}`} onClick={() => setIsFocused(isFoc => !isFoc)}>
      
      <figure>
        <img src={isFocused ? photoUrls.medium : photoUrls.small} alt={title} />
        <figcaption>
          <div className="details">
            {/* {`${photoUrls.large}`} */}
            <a href={photoUrls.large} className="title">{title}</a>
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
