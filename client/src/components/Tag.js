import React, { useEffect, useState } from 'react'
import '../sass/Tag.scss';

export default function Tag ({
  tagText,
  filterHandler,
  searchHandler,
  isInCard,
  tagIsSelected,
  clearFilterTags}) {

  const [isSelected, setIsSelected] = useState(tagIsSelected);

  useEffect(() => {
    setIsSelected(tagIsSelected);
  }, [tagIsSelected])

  return (
    <li
      className={`${isSelected && 'selected'} ${!isInCard &&  'filter'}`}
      key={tagText}
      onClick={(e) => {
        e.stopPropagation();
        searchHandler(tagText);
        // filterHandler(null);
        clearFilterTags();
      }}
    >
      <div className="tag-text">
        {tagText}
      </div>
      <button disabled={isSelected}

        onClick={(e) => {
          e.stopPropagation();
          filterHandler(tagText);
        }}>+</button>
    </li>
  )
}
