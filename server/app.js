const express = require('express')
// const cors = require('cors')
const multer = require('multer')
// const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const cookieParser = require('cookie-parser')

const SECRET = 'dhgdkkdgdjk' //随机的一段字符串

const sqlMap = require('./sqlMap')

const DIR = __dirname + '/uploads/'

const app = express()
const port = 3003

let db
const dbPromise = require('./db.js')

dbPromise.then(value => {
  db = value
})

app.locals.pretty = true

//跨域cors
// app.use(
//   cors({
//     maxAge: 86400,
//     origin: true,
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],

//   })
// )

//使用cookieParser
app.use(cookieParser(SECRET))

//使用一个中间件，从签名的cookie中找出该用户的信息并挂在req对象上以供后续的中间件访问
app.use(async (req, res, next) => {
  if (req.signedCookies.userName) {
    req.user = await db.get(sqlMap.user.data, req.signedCookies.userName)
  }
  next()
})

//使用json中间件，解析json
app.use(express.json())

//文件存储地址
app.use('/uploads', express.static(__dirname + '/uploads'))

//将静态文件放在静态文件夹
app.use(express.static(__dirname + '/build'))

// app.get('/', (req, res) => {
//   res.redirect('/home/total')
// })

// app.get(/\/build\//, (req, res) => {
//   res.sendFile(__dirname + 'index.html')
// })

//判断是否登录过
app.get('/isLogined', (req, res) => {
  if (req.user) {
    res.json({
      code: 0,
      user: req.user
    })
  } else {
    res.json({
      code: -1,
      msg: '用户未登录'
    })
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR)
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-')
    cb(null, fileName)
  }
})

var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  }
})

//注册

app.route('/register').post(upload.single('avator'), async (req, res) => {
  try {
    //注册的时候需要判断用户名是否重复
    let user = req.body
    // console.log(req.body)
    let check = await db.get(sqlMap.user.check, user.name)
    if (!check) {
      let time = new Date().toISOString()
      let avator = req.file.filename

      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(user.password, salt)

      await db.run(sqlMap.user.add, [user.name, hash, time, avator, user.email])
      // res.send('用户注册成功')
      res.json({
        code: 0,
        msg: '用户注册成功'
      })
    } else {
      res.json({
        code: -1,
        msg: '用户已被注册'
      })
    }
    // console.log(req.body)
    res.end('ok')
  } catch (error) {
    console.log(error)
  }
})

//登录
app.route('/login').post(async (req, res) => {
  try {
    let user = req.body
    // console.log(user)

    let check = await db.get(sqlMap.user.check, user.name)
    let getHashPassword = await db.get(
      'select password from users where name = (?) ',
      user.name
    )

    let result = bcrypt.compareSync(
      String(user.password),
      getHashPassword.password
    )
    if (!check) {
      res.json({
        code: -2,
        msg: '用户未注册'
      })
    } else if (!result) {
      res.json({
        code: -1,
        msg: '密码错误'
      })
    } else {
      // console.log(logined)
      // const token = jwt.sign(
      //   {
      //     id: String(logined.userId)
      //   },
      //   SECRET
      // )
      // //登录成功之后向客服端发送一个token，这个token可以存放在客户端的本地里面，之后在发送请求时带上这个token
      // res.json({token: token})

      //登录成功之后，向浏览器发送一个cookie，同时发送登录成功
      res.cookie('userName', user.name, {
        maxAge: 86400000,
        signed: true
      })
      let userdata = await db.get(sqlMap.user.data, user.name)
      res.json({
        code: 0,
        msg: '登陆成功',
        user: userdata
        // return_url: req.get('referer'),
      })
    }
  } catch (error) {
    console.log(error)
  }
})

//显示所有的帖子,并在登录的状态下发帖
app
  .route('/posts/:categoryId')
  .get(async (req, res) => {
    let id = req.params.categoryId
    if (id != 0) {
      let posts = await db.all(sqlMap.posts.data, id)
      res.json(posts)
    } else {
      let posts = await db.all('select * from posts  order by postId desc')
      res.json(posts)
    }
  })
  .post(async (req, res) => {
    try {
      if (req.user) {
        let posts = req.body
        let id = req.params.categoryId
        let time = new Date().toISOString()
        await db.run(
          sqlMap.posts.add,
          posts.userId,
          posts.title,
          time,
          posts.content,
          id
        )
        res.json({
          code: 0,
          message: '发帖成功'
        })
      } else {
        res.json({
          code: -1,
          message: '未登录，无法发帖'
        })
      }
    } catch (error) {
      console.log(error)
    }
  })

//显示帖子下面的回复，并在登录的状态下回帖
//动态路由 回复/发帖的唯一标识符
app
  .route('/comments/:postId')
  .get(async (req, res) => {
    //通过postId来获得回复
    let postId = req.params.postId
    // console.log(postId)
    let comments = await db.all(sqlMap.comments.data, Number(postId))
    res.json(comments)
  })
  .post(async (req, res) => {
    if (req.user) {
      let postId = req.params.postId
      let time = new Date().toISOString()
      // console.log(req.body)
      await db.run(
        sqlMap.comments.add,
        Number(postId),
        req.body.content,
        time,
        req.user.userId
      )
      res.json({
        code: 0,
        msg: '成功添加回复'
      })
    } else {
      res.json({
        code: -1,
        msg: '用户未登录'
      })
    }
  })

//获取个人信息
app.post('/profile', async (req, res) => {
  // console.log(req.body)
  let userId = req.body.userId
  let profile = await db.get(
    'select name,registerTime,avator,email from users where userId = (?)',
    userId
  )
  // console.log(profile)
  res.json(profile)
})

//根据postId获取帖子的详情
app.get('/postDetail', async (req, res) => {
  let postId = req.query.postId
  // console.log(req)
  let post = await db.get(sqlMap.posts.search, Number(postId))
  res.json(post)
})

//退出登录
app.get('/signout', async (req, res) => {
  res.clearCookie('userName')
  res.json({
    code: 0,
    msg: '成功退出'
  })
})

//拿到所有的帖子，并有用户的信息
app.get('/getAllPosts', async (req, res) => {
  let id = req.params.categoryId
  if (id != 0) {
    let posts = await db.all(
      `SELECT posts.postId,posts.userId,posts.title,posts.time,posts.content,posts.category,users.name,users.avator
      from posts
      LEFT JOIN users
      WHERE posts.userId == users.userId
      AND category ==(?)
      rder by postId desc`,
      id
    )
    res.json(posts)
  } else {
    let posts = await db.all(
      `SELECT posts.postId,posts.userId,posts.title,posts.time,posts.content,posts.category,users.name,users.avator
      from posts
      LEFT JOIN users
      WHERE posts.userId == users.userId
      order by postId desc`
    )
    res.json(posts)
  }
})

//端口监听
app.listen(port, () => {
  console.log('server listening on port', port)
})
