import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory,useLocation } from "react-router-dom";
import { getPosts } from "../../api/api";
import "./HomeMain.scss";
import ContentItem from "./ContentItem";



const ContentContainer = (props) => {
  // console.log(props.posts)
  return (
    <div className="content-container">
      <div className="posts">
        {
          props.posts.length > 0 ?
        (props.posts.map((item) => (
          <ContentItem item={item} key={item.postId} />
        ))) : null}
      </div>
    </div>
  );
};



const HomeMain = () => {
  const history = useHistory();
  const {pathname} = useLocation()


  const classifyData = [
    { name: "全部", categoryId: 0, path: "/total" },
    { name: "分享", categoryId: 1, path: "/share" },
    { name: "讨论", categoryId: 2, path: "/discuss" },
    { name: "吐槽", categoryId: 3, path: "/complain" },
    { name: "夸夸", categoryId: 4, path: "/complement" },
  ];

  const [currentInedx, setCurrentIndex] = useState(0);
  const [categoryId, setCategoryId] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  const itemClick = (index, path) => {
    setCurrentIndex(index);
    setCategoryId(index);
    history.push(`/home${path}`);
  };

  const ItemList = classifyData.map((item, index) => (
    <div
      className={index === currentInedx ? "active item" : "item"}
      key={item.path}
      onClick={() => itemClick(index, item.path)}
    >
      {item.name}
    </div>
  ));

  //写主页面所有的帖子,首先帖子的数据得先拿到，得使用useEffect,然后，将数据渲染

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts(categoryId).then((res) => {

      let data = res.data;
      //console.log(data)
      setPosts(data);
      setIsLoading(false)
    });
  },[categoryId,pathname]);

  return (
    <div className="home-main">
      <div className="classify">
        {ItemList}
      </div>
      <div className="container">
        {isLoading ? null :
        <ContentContainer posts={posts} />}
      </div>
    </div>
  );
};

export default HomeMain;
