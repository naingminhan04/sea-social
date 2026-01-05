'use client'

import { PostType } from '@/types/post';
import { useState } from 'react';

const CONTENT_LIMIT = 200;

const PostContent = ({post} : {post:PostType}) => {
    const [seeMore, setSeeMore] = useState(false);
  const content = post.content;
  const isLongContent = content.length > CONTENT_LIMIT;
  const showContent = seeMore && isLongContent;

  const toggleSeeMore = () => {
    setSeeMore((prev) => !prev);
  };

  return (
    <div>
      {showContent ? content : content.slice(0, CONTENT_LIMIT)}
        {isLongContent && (
          <button className='text-black hover:text-neutral-950 active:scale-90' onClick={toggleSeeMore}>
            {seeMore ? <span className='px-2'>See less</span> : "...See more"}
          </button>
        )}
    </div>
  )
}

export default PostContent