### bbs后端接口

##### 注册
* path： /register
* post
* data:

##### 登录
* path： /login
* post
* data: name,passaword

##### 发帖
* path: /posts/:categoryId  categoryId是帖子的分类
* 如果是get方法，则拿到当前分类下的所有帖子信息
* 如果是post，就是发送新帖子，data： userId(发帖人的id) title(新帖子的标题)  content(新帖子的内容)


##### 评论
* path：/comments/:postId   postId是帖子的Id
* 如果是get方法，拿到特定postId下的所有的评论
* 如果是post方法，在特定的帖子下新增评论 data:content(评论的内容)

##### 获取个人信息
* path: /profile
* post
* data: userId

##### 获取帖子的详细信息
* path: /postDetail
* get

##### 退出登录
* path: /signout
* get


##### 帖子信息+用户信息
* 为了让前端拿到数据更简单一些，新增一个接口,参数应该是帖子的分类
* path: /getAllPosts
* get


