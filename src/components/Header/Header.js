import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import './Header.scss'

const Header = () => {
  const isLogined = useSelector((state) => state.isLogined);
  const loginedUser = useSelector((state) => state.loginedUser);
  // const isLogined = false
  // const loginedUser = {name: 'xj',age:'21'}

  const history = useHistory();
  const signOut = () => {};
  const goToHome = () => {
    history.push("/home");
  };
  const login = () => {
    history.push("/login")
  }
  const register = () => {
    history.push("/register")
  }

  return (
    <div className="header">
      <div className="header-container">
        <div className="left-log">
          <span>FEG</span>
        </div>
        <div className="right-login">
          {isLogined ? (
            <div className="logined">
              <div className="sign-out" onClick={signOut}>
                登出
              </div>
              <div className="user">{loginedUser.name}</div>
              <div className="home" onClick={goToHome}>首页</div>
            </div>
          ) : (
            <div className="no-logined">
              <div onClick={login}>登录</div>
              <div onClick={register}>注册</div>
              <div className="home" onClick={goToHome}>首页</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
