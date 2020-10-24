import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./views/Home";
import PostDetail from "./components/PostDetail/PostDetail";
import CreatePost from "./components/CreatePost/CreatePost";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
// import 'antd/dist/antd.css'

import bcImg from "./assets/bgc.jpg";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <div className="header-container">
        <Header></Header>
      </div>
      <div className="img">
        <img src={bcImg} alt=""/>
      </div>
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/home">
            <Home></Home>
          </Route>
          <Route path="/postdetail/:postId">
            <PostDetail />
          </Route>
          <Route path="/createpost">
            <CreatePost />
          </Route>
          <Route path="login">
            <Login />
          </Route>
          <Route path="register">
            <Register />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
