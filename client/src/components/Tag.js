import React, { useEffect, useState } from 'react'
import '../css/Tag.css';

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
      className={`${isSelected ? 'selected' : ''} ${!isInCard &&  'filter'}`}
      key={tagText}
      onClick={(e) => {
        e.stopPropagation();
        searchHandler(tagText);
        if (clearFilterTags)  clearFilterTags();
      }}
    >
      <div className="tag-text">
        {tagText}
      </div>
      <button disabled={isSelected}
        name="add-tag-to-filter"
        onClick={(e) => {
          e.stopPropagation();
          filterHandler(tagText);
        }}>{
          isInCard && !isSelected
            ? '+'
            : !isInCard
              ? 'x'
            : ''}</button>
    </li>
  )
}
