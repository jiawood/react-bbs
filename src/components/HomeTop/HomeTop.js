import React from 'react';
import {useSelector} from 'react-redux';
import { Button } from 'antd';
import { useHistory } from "react-router-dom";
import './HomeTop.scss'

const HomeTop = () => {
  const isLogined = useSelector(state => state.isLogined)
  const loginedUser = useSelector(state => state.loginedUser)
  const history = useHistory()
  const goPost = () => {
    history.push("/post")
  }
  return (
    <div className="home-top">
      {
        isLogined? (
          <div className="logined">
            <div className="welcome">嗨，{loginedUser.name}</div>
            <div className="message">您已登录，快来发布新主题吧~</div>
            <Button type="primary" onClick={goPost}>发布新主题</Button>
          </div>
        ):(
          <div className="unlogined">
            <div className="welcome">欢迎来到前端小组</div>
            <div className="message">您还未登录,暂时无法发布新主题！</div>
            <Button disabled>发布新主题</Button>
          </div>
        )
      }
    </div>
   );
}

export default HomeTop;
