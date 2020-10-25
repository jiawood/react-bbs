import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getComments, getProfile, postDetail,addComment } from "../../api/api";
import { parseTime } from "../../Utils";
import { useSelector } from "react-redux";

import {Input, Button, notification} from 'antd';
import { SmileOutlined ,FrownTwoTone} from '@ant-design/icons';
import "./PostDetail.scss";
import {useRef} from "react";
import userReducer from "../../reducers/userReducer";

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

const AddComment = ({setCommentInfo,commentInfo}) => {
  const {TextArea} = Input
  const isLogined = useSelector(state => state.isLogined)
  const loginedUser = useSelector(state => state.loginedUser)
  const contentRef = useRef()
  const postId = useParams()

  const submit = (e) => {
    e.preventDefault()
    if(!isLogined){
      notification.open({
        message: '回复失败！',
        description:
          '您未登录，暂时无法回复。请先登录之后，再回复哟！',
        icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
      });
    }else{
      addComment(postId,contentRef.current.value).then(res => {
        if(res.data.code === 0){

          let data = {
            commentId: 56,
            content: contentRef.current.value,
            postId: postId,
            time: new Date().toString(),
            userId: loginedUser.userId
          }
          commentInfo.push(data)
          setCommentInfo(commentInfo)
          notification.open({
            message: '回复成功！',
            description:
              '您已成功发表一条回复',
            icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
          });
        }else {
          notification.open({
            message: '回复失败！',
            description:
              '很抱歉，发生未知错误！',
            icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
          });
        }
      })
    }


  }

  return (
    <div className="add-comments">
      <div className="header">
        <div className="left">增加一条新回复</div>
      </div>
      <div className="form">
        <TextArea rows={4} ref={contentRef}></TextArea>
      </div>
      <div className="submit" onClick={submit}>
          <Button className="button">回复</Button>
      </div>
    </div>
  )
}

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
          <span>{commentInfo.length}</span>条回复·
          <span>{new Date().toString()}</span>
        </div>
        <div className="comment">
          {commentInfo.map((comment) => (
            <CommentItem
              key={comment.time}
              comment={comment}
            ></CommentItem>
          ))}
        </div>
      </div>
      <div className="add-comments">
        <AddComment setCommentInfo = {setCommentInfo} commentInfo = {commentInfo}></AddComment>
      </div>
    </div>
  );
};

export default PostDetail;
