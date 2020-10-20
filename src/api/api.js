import {request} from '../Utils'

//获取分类为3的所有的帖子
export function getPosts(categoryId) {
  return request({
    url: `/posts/${categoryId}`
  })
}

//增加帖子
export function addPosts(userId, title, content, value) {
  return request({
    url: `/posts/${value}`,
    method: 'post',
    data: {
      userId,
      title,
      content
    }
  })
}

//获得回复
export function getComments(postId) {
  return request({
    url: `/comments/${postId}`
  })
}

//增加回复
export function addComment(postId, content) {
  return request({
    url: `/comments/${postId}`,
    method: 'post',
    data: {
      content
    }
  })
}

//获取个人信息
export function getProfile(userId) {
  return request({
    url: '/profile',
    method: 'post',
    data: {
      userId: userId
    }
  })
}

//获取数据评论
export function getPostComment(id) {
  return request({
    url: '/post',
    method: 'post',
    data: {
      id: id
    }
  })
}

//注册
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

//登录
export function login(name, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      name,
      password
    }
  })
}

//获得帖子详情
export function postDetail(postId) {
  return request({
    url: '/postDetail',
    method: 'get',
    params: {
      postId
    }
  })
}

//页面刷新时，通过cookie判断用户是否登录，设置vuex里面的loginedUser
export function userIsLogined() {
  return request({
    url: '/isLogined',
    method: 'get'
  })
}

//登出
export function signOut() {
  return request({
    url: '/signout'
  })
}
