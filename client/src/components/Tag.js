import React from 'react'
import '../sass/Tag.scss';

export default function Tag({tagText}) {
  return (
    <li key={tagText} onMouseEnter={(e) => {
      e.stopPropagation();
    }}>
      <div className="tag-text">
        {tagText}
      </div>
      <button onMouseEnter={(e) => {
        e.stopPropagation();
      }}>+</button></li>
  )
}
