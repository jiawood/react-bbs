import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getComments, getProfile, postDetail } from "../../api/api";
import { parseTime } from "../../Utils";
import "./PostDetail.scss";

const CommentItem = ({ comment }) => {
  const [profileInfo, setProfileInfo] = useState([]);
  useEffect(() => {
    getProfile(comment.userId).then((res) => {
      setProfileInfo(res.data);
    });
  }, []);
  return (
    <div className="comment-item">
      <div className="avator">
        <img
          src={process.env.REACT_APP_AVATAR_BASEURL + profileInfo.avator}
          alt=""
          srcset=""
        />
      </div>
      <div className="message">
        <span className="name">{profileInfo.name}</span>·
        <span className="time">{parseTime(comment.time)}</span>
      </div>
      <div className="commnets">{comment.content}</div>
    </div>
  );
};

const PostDetail = () => {
  let { postId } = useParams();
  const [userId, setUserId] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [postInfo, setPostInfo] = useState([]);
  const [commentInfo, setCommentInfo] = useState([]);
  const [contentLines, setContentLines] = useState([]);

  useEffect(() => {
    postDetail(postId).then((res) => {
      let data = res.data;
      setPostInfo(data);
      setUserId(data.userId);
      setContentLines(res.data.content.split('\n'))
    });
  }, []);


  useEffect(() => {
    getProfile(userId).then((res) => {
      setUserInfo(res.data);
    });
  }, [userId]);

  useEffect(() => {
    getComments(postId).then((res) => {
      setCommentInfo(res.data);
    });
  }, []);



  return (
    <div className="post-detail">
      <div className="header-content">
        <div className="header">
          <div className="title">{postInfo.title}</div>
          <div className="message">
            <span className="name">{userInfo.name}</span>·
            <span className="time">{parseTime(postInfo.time)}</span>
          </div>
          <div className="avator">
            <img
              src={process.env.REACT_APP_AVATAR_BASEURL + userInfo.avator}
              alt=""
              srcset=""
            />
          </div>
        </div>
        <div className="post-content">{contentLines ? contentLines.map((line,index) => <p key={index}>{line}</p>) : null}</div>
      </div>
      <div className="comments">
        <div className="top">
          <span>{commentInfo.length}</span>·条回复
          <span>{new Date().toString()}</span>
        </div>
        <div className="comment">
          {commentInfo.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
            ></CommentItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
