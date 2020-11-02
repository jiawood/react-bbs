import React from 'react';
import ContentItem from "./ContentItem";

const ContentContainer = (props) => {
  // console.log(props.posts)
  return (
    <div className="content-container">
      <div className="posts">
        {props.posts.length > 0
          ? props.posts.map((item) => (
              <ContentItem item={item} key={item.postId} />
            ))
          : null}
      </div>
    </div>
  );
};

export default ContentContainer
