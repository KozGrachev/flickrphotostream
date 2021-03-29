import React, { useEffect, useRef, useState } from 'react';
import '../css/Card.css';
import Tag from './Tag';


export default function Card ({
  title,
  photoUrls,
  author,
  authorUrl,
  description,
  tags,
  filterHandler,
  searchHandler,
  filterTags,
  clearFilterTags }) {

  const [isFocused, setIsFocused] = useState(false)
  const descriptionRef = useRef();

  useEffect(() => {
    descriptionRef.current.innerHTML = description;
  }, [description]);

  return (
    <figure onScroll={(e)=> e.stopPropagation()} className={`card-container ${isFocused ? 'focused' : 'unfocused'}`} >
      <img
        onClick={() => isFocused || setIsFocused(isFoc => !isFoc)}
        src={
          isFocused && photoUrls.xl
            ? photoUrls.xl
            : isFocused && !photoUrls.xl
              ? photoUrls.l
              : photoUrls.s
        }
        alt={title}
        className={isFocused ? 'clickable' : ''}
      />
      <figcaption>

        <div className="details">
          {/* {`${photoUrls.l}`} */}
          <a href={photoUrls.xl} className="title">{title}</a>
          <div className="author">
            <i>by</i> <a href={authorUrl} >{author}</a>
          </div>
        </div>
        <div className="description-tags-wrapper">
          <div className="description-container" ref={descriptionRef} />
          <div className="tags-list-wrapper">
            <ul className="tags-list">{tags.split(' ').map((tag, i) => {
              return <Tag
                tagText={tag}
                filterHandler={filterHandler}
                searchHandler={searchHandler}
                clearFilterTags={clearFilterTags}
                isInCard={true}
                tagIsSelected={filterTags.length && filterTags.includes(tag)}
                key={tag + i} />
            })}
              <div className="shadow-box" />
            </ul>
          </div>
        </div>
      </figcaption>
      {isFocused && <button
        className="close-focused-button"
        onClick={() => setIsFocused(isFoc => !isFoc)}>
        X
          </button>}
    </figure>
  )
}
