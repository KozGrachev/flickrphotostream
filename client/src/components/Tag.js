import React, { useEffect, useState } from 'react'
import '../sass/Tag.scss';

export default function Tag ({ tagText, filterHandler, isInCard, tagIsSelected}) {

  const [isSelected, setIsSelected] = useState(tagIsSelected);

  useEffect(() => {
    setIsSelected(tagIsSelected);
  }, [tagIsSelected])

  return (
    <li
      className={`${isInCard && isSelected && 'selected'}`}
      key={tagText}
      onMouseEnter={(e) => {
      e.stopPropagation();
    }}>
      <div className="tag-text">
        {tagText}
      </div>
      <button disabled={isSelected}
        // onMouseEnter={(e) => {
        //   e.stopPropagation();
        // }}
        onClick={() => {
          filterHandler(tagText);
        }}>+</button>
    </li>
  )
}
