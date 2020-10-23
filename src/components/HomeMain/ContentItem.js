import React from "react";
import { useState, useEffect } from "react";
import { getComments, getProfile } from "../../api/api";
import { parseTime } from "../../Utils";
import { useHistory } from "react-router-dom";

//子组件的props应该是一个单独的item，里面包含了帖子的信心，userId,postId,name,content,
//分别通过userId和postId拿到用户的信息和帖子的信息，这些信息全放在props上
const ContentItem = (props) => {
  //console.log(props)
  const [userInfo, setUserInfo] = useState([]);
  const [commentsInfo, setCommentsInfo] = useState([]);

  const history = useHistory();

  useEffect(() => {
    getProfile(props.item.userId).then((res) => {
      let data = res.data;
      // console.log(data)
      setUserInfo(data);
    });
  }, [props.item.userId]);
  useEffect(() => {
    getComments(props.item.postId).then((res) => {
      let data = res.data;
      //console.log(data)
      setCommentsInfo(data);
    });
  }, [props.item.postId]);

  const clickItem = (postId) => {
    history.push(`/comments/${postId}`)
  };

  const tagMap = { 1: "分享", 2: "讨论", 3: "吐槽", 4: "夸夸" };

  const tag = tagMap[props.item.category];



  return (
    <div
      className="content-item"
      onClick={() => clickItem(props.item.postId)}
    >
      <div className="avator">
        <img src={`http://localhost:3001/uploads/${userInfo.avator}`} alt="" />
      </div>
      <div className="content">
        <div className="title">{props.item.title}</div>
        <div className="detail">
          <span className="share">{tag}</span>·
          <span className="user">{userInfo.name}</span>·
          <span className="time">{parseTime(props.item.time)}</span>
        </div>
      </div>
      <div className="counts">
        {commentsInfo.length > 0 ? (
          <div className="count">{commentsInfo.length}</div>
        ) : null}
      </div>
    </div>
  );
};

export default ContentItem;
