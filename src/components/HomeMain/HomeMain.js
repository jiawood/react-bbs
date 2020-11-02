import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getPosts } from "../../api/api";
import "./HomeMain.scss";
import ContentContainer from './ContentContainer'



const HomeMain = () => {
  const history = useHistory();
  const { path } = useParams();

  const classifyData = [
    { name: "全部", categoryId: 0, path: "/total" },
    { name: "分享", categoryId: 1, path: "/share" },
    { name: "讨论", categoryId: 2, path: "/discuss" },
    { name: "吐槽", categoryId: 3, path: "/complain" },
    { name: "夸夸", categoryId: 4, path: "/complement" },
  ];

  const [currentInedx, setCurrentIndex] = useState(0);
  const [categoryId, setCategoryId] = useState(0);

  const itemClick = (index, tpath) => {
    setCurrentIndex(index);
    setCategoryId(index);
    if(path !== tpath){
      history.push(`/home${tpath}`);
    }
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
    let map = { total: 0, share: 1, discuss: 2, complain: 3, complement: 4 };
    setCurrentIndex(map[path]);
    getPosts(map[path]).then((res) => {
      let data = res.data;
      //console.log(data)
      setPosts(data);
    });
    return () => {
      map = null;
    };
  }, [categoryId, path]);

  return (
    <div className="home-main">
      <div className="classify">{ItemList}</div>
      <div className="container">
         <ContentContainer posts={posts}></ContentContainer>
      </div>
    </div>
  );
};

export default HomeMain;
