### simple-board express-generator 프로젝트

### CRUD란?
#### create, read, update, delete 
##### 데이터를 다루는 네 가지 기본적인 기능
##### 일반적으로 위 네가지에 대한 구현이 가능해야 서비스 개발에 필요한 요구사항을 맞출 수 있음

#### create
##### 게시판은 게시글을 작성할 수 있어야 함, 게시글 작성 시 제목, 내용, 작성자, 작성 시간 등의 정보를 기록함, 게시글의 제목과 내용은 최소 n 글자 이상이어야 함  

#### read
##### 게시판은 게시글의 목록과 게시글의 상세를 볼 수 있어야함 게시글 목록은 제목과 작성자, 작성시간의 간략화된 정보를 보여줌, 게시글 상세는 제목, 작성자, 내용, 작성시간, 수정시간 등의 상세한 정보를 보여야함



#### update
##### 게시판의 게시글은 수정이 가능해야함, 게시글 수정 시 제목과 내용이 수정 가능하고 수정 시간이 기록되어야 함, 게시글의 제목과 내용은 최소 n글자 이상이어야함



#### delete
##### 게시판의 게시글은 삭제가 가능해야함, 게시글 삭제시 목록과 상세에서 게시글이 접근되지 않아야 함

### Express.js + Mongoose로 CRUD 구현하기 -  모델 선언하기
##### Mogo DB의 Object ID는 URL에 사용하기 좋은 값이 아니기 때문에 대체할 수 있는 아이디를 shortId로 생성, 제목,내용,작성자를 string 타입으로 스키마에 선언 , timestamps 옵션으로 작성 시간, 수정 시간을 자동으로 기록해 줌



###### post모델
```javascript
// ./models/schemas/post.js
const mongoose, {Schema} = require('mogoose');
const shortId = require('./types/short-id');

module.exports = new Schema({
    shortId,
    title : String,
    content : String,
    author : String,
},{
    timestamps : true,
});

// ./models/index.js
exports.Post = monggose('Post', PostSchema)
```

### Express.js + Mongoose로 CRUD 구현하기 -  shortId
##### objectId를 대체할 shortId 타입을 Mongoose Custom Type으로 선언, 중복 없는 문자열을 생성해 주는 nanoid 패키지 활용, default를 이용해 모델 생성 시 자동으로 ObjectId를 대체할 아이디 생성

###### shortId
```javascript
// 여기서 default 함수를 전달할때, shortId값이 전달되지 않았을때 자동으로 함수를 사용하여 자동으로 nanoid함수를 실행하게 하여 nanoid를 만들수 있다.
const {nanoid} = require('nanoid');
const shortId = {
    type : String,
    default : () =>{
        return nanoid();
    },
    require : true,
    index : true,
}
module.exports = shortId ; 
```
### Express.js + Mongoose로 CRUD 구현하기 -  게시글 작성
#### 게시글 작성 흐름
##### 1. ./posts?write=true 로 작성페이지 접근
##### 2. <form action = "posts" method="post"> 를 이용해 post 요청 전송
##### router.get 을 이용하여 post 요청 처리
##### res.redirect를 이용하여 post 완료 처리

##### 게시글 작성 - 작성페이지 만들기
###### ./routes/post.js
```javascript
// posts 라우터를 구현이 되어있고, posts 라우터에 구현되어 있는 내용은 아래와 같다. 이때 router.get('/')의 경로는 /posts 가 된다. 이때 query에 write 가 있다면 posts/edit 경로로 들어간다.

const {Router} = require('express');
const router = Router();
router.get('/', (req,res,next) => {
    if(req.query.write){
        res.render('posts/edit');
        return;
    }
    ...
});
...
module.exports = router;
```

###### ./views/posts/edit.pug
```javascript
// posts/edit 경로에 보여지는 화면이다. edit에서는 form 태그가 구현이 되어있고 form 매서드가 post로 되어있다. 제목에는 title, 내용은 content로 하여 input 과 textarea로 작성을 할 수 있게 되어있고 작성이 완료가 되면 등록버튼을 눌러서 post요청을 날리게 되어있다.
...
form(action="/posts", method="post")
    table
        tbody
            tr
                th 제목
                td: input(type="text" name="title")
            tr
                th 내용
                td textarea(name="content")
            tr
                td(colspan="2")
                    input(type="submit" value="등록")
```

##### 게시글 작성 - POST 요청 처리하기
###### ./routes/posts.js
```javascript
//form태그를 전송된 post 요청을 처리하는 방법  , 방금 작성한 posts 라우터 아래에 이어서 적는다. 라우터의 post매서드를 사용하여 /posts 경로로 요청이 들어올때 input으로 title, content 요청이 들어온 부분을 req.body로 받는다.

// Post 모델을 사용해서 create함수로 모델 안에 documents를 만든다. async 함수의 await로 post함수를 처리하게 되면 정상적으로 mongo db에 데이터가 생성이 된다. 
// 데이터가 생성이 되면 response 의 redirect로 ('/') 루트 패스로 이동한다. 게시글 완료가 되면 자동으로 루트 페이지로 돌아가게 된다.
// 작성된 게시글로 돌아가는 방법은 create에 생성된 post를 받아, res.redirect('/posts/post.shortid')로 설정하면 게시글로 돌아갈 수 있다.

const { Post} = require('./models');
...
router.post('/', async(req, res, next)=>{
    const {title, content} = req.body;
    try {
        await Post.create({
            title,
            content
        });
        res.redirect('/');
    } catch(err){
        next(err);
    }
});
```
#### 게시글 목록 및 상세 - 게시글 목록 및 상세흐름 방법
##### 1. /posts로 목록 페이지 접근
##### 2. <a href="/posts/:shortId"> 를 이용하여 상세 URL Link
##### 3. router.get('/:shortId') path parameter 이용하여 처리


##### 게시글 목록 구현하기
###### ./routes/posts.js 
```javascript
// 작성된 모든 게시글을 get라우터를 통해 posts로 모두 가져온다. find함수를 통해 가져온 posts는 posts/list라는 view로 전체 게시물을 가져온다

router.get('/', async(req, res, next)=>{
    const posts = await Post.find({});
    res.render('posts/list', {posts});
})
```
###### ./views/posts/list.pug
```javascript
// posts/list view 안에 each ~ in으로 순환을 한다. post를 사용하여 post.shortId로 링크를 만든다. 화면을 구현되었을때 a링크를 클릭하면 post.shortId로 링크가 움직인다. formatDate는 pug탬플릿에서 지원하는 함수이다. app.js에서 formDate를 구현시켜 놓고, dayjs라이브러리를 통해 해당 함수를 구현한다.
table
    body
        each post in posts
            tr
                td
                    a(href='/posts/${post.shortId}')
                        = post.title
                td = post.author
                td = formatDate(post.createdAt)
        tfoot
            tr
                td(colspan="3")
                    a(href="/posts?write=true")
                        등록하기
```

###### app.js
```javascript
//
const dayjs = require('dayjs')
app.locals.formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
```
##### 게시글 상세 구현하기
###### ./routes/posts.js
```javascript
//shortId 라우터로 왔을때 shortId 를 pathparemeter(req.params)를 통해 받고, shortId를 findOne 함수를 통해 검색을 한다. 이렇게 찾아진 post가 없다면 에러를 보내고 있다면 posts/view 탬플릿 으로 뷰를 보낸다.
router.get('/:shortId', async(req, res, next)=>{
    const {shortId} = req.params;
    const post = await Post.findOne({ shortId });
    if(!post){
        next(new Error('post NotFound'));
        return;
    }
    ...
    res.render('/posts/view', { post });
})
```
###### ./views/posts/View.pug
```javascript
// posts/view에서는 게시글 작성자, 내용, 생성시간을 보낸다. 
...
table
    tbody
        tr
            td(colspan="2")=post.title
        tr
            td = post.author
            td = formatDate(post.createdAt)
        tr
            td(colspan="2"):pre = post.content
        tr
            td : a(href='/posts/${post.shortId?edit=true}')
                수정
        tr
            td 
                button(onclick='deletePost("${post.shortId}")')
                삭제
```

#### 게시글 수정 흐름
##### 1. /posts/{shortId}?edit=true 로 수정페이지 접근
##### 2. 작성페이지를 수정페이지로도 동작하도록 작성
##### 3. <form actin="/posts/:shortId" method="post">로 post 요청 전송
###### html form은 PUT method를 지원하지 않기 때문에 post 사용

##### 수정 페이지 만들기
###### ./routes/post.js
```javascript
// 상세페이지에서 사용했던 shortId를 사용했던 URL에서 query가 edit으로 들어가면, 응답으로 posts/edit 페이지를 띄운다.  여기서 상세페이지에서 찾은 post 값을 post.edit 페이지로 같이 보닌다.
router.get('/:shortId', async(req, res, next)=>{
    ...
    if(req.query.edit){
        res.render('/posts/edit', {post});
    }
    ...
})
```

###### ./views/posts/edit.pug
```javascript
// post가 있는 경우에는 action을 posts/post.shortID로 보낸다. post가 없다면 작성하기 위한 url /posts로 보낸다. form 태그에서 매서드는 post를 사용한다.
// input 값에서 value=post&&post.title 의미는 post가 있다면 title을 제목으로 삼고, textarea도 마찬가지로 내용이 있다면 content를 내용으로 삼는다. 
...
- var action = post ? '/posts/${post.shortId}' : "/posts/"
form(action = action, method="post")
table
    tbody
        tr
            th 제목
            td : input(type="text" name="title" value=post&&post.title)
        tr
            th 내용
            td : textarea(name="content")= post&&post.content
        td
            td(colspan="2")
            - var value = post ? "수정" : "등록"
            input(type="submit" value=value)
```
 
##### 게시물 수정 - 수정 요청 처리하기
###### ./routes/posts.js
```javascript
// form 에서 shortid를 통해 보낸 요청을 /:shortId 경로를 통해 값이 전해진 것을 볼 수 있다. 전달받은 shortId 를 path parameter(req.params)로 받고, title과 content를 req.body로 받는 것을 알 수 있다. shorId로 findOneAndUpdate를 한다. findOneAndUpdate로 검색을 하여 내용을 title 과 content로 변경을 한다
// 만약에 shortid로 검색된 title 과 content 가 없다면 post는 undefined가 없다면 에러를 만든다. 게시글 수정이 완료가 되면 게시글 상제 페이지로 redirect한다. redirect는 항상 get 매서드로 사용한다. 
...
router.post('/:shortId', async(req,res,next)=> {
    const {shortId} = req.params;
    const {title, content} = req.body;
    const post = await Post.findOneAndUpdate({shortId}, {
        title, content,
    });
    if(!post){
        next(new Error('post NotFound'));
        return;
    }
    res.redirect(`/posts/${shortId}`);
})
```

#### 게시글 삭제 기능 만들기
##### 1. 게시글 삭제 페이지에 삭제 버튼 추가
##### 2. html form은 DELEE 매서드를 지원하지 않음
##### 3. JavaScript에서 fetch 함수로 HTTP Delete 요청 전송
##### 4. router.delete의 응답을 fetch 에서 처리

##### 게시판 삭제 - HTTP Delete 요청 전송 및 응답 처리
###### posts/view.pug
```javascript
// button에 delete를 만들어주고 버튼을 deletePost로 만들었다. deletePost 는 pug에 script로 선언하여 구현하였다.
td
    button.delete(
        onclick = 'deletePost("${post.shortId}")'
    ) 삭제
```


```javascript
// deletePost 에 shortID를 전달을 받아 posts에 shortId경로로 매서드 delete를 통해 전송한다. fetch 함수는 promise함수를 통해 받는다. fetch promise가 성공하면 성공했습니다. 실패하면 오류가 발생했습니다 라고 alert을 보낸다. 삭제가 완료가 되면 게시글 목록으로 보낸다.
...
script(type="text/javascript")
    function deletePost(shortId){
        fetch('/posts/' + shortId, {method: 'delete'})
            .then((res)=>{
                if (res.ok){
                    alert('삭제되었습니다.');
                    window.location.href = '/posts';

                } else{
                    alert('오류가 발생했습니다.');
                    console.log(res.satusText);
                }
            })
            .catch((err)=>{
                console.log(err);
                alert('오류가 발생했습니다.');
            })
    }
```
##### delete 요청 처리하기
###### ./routes/posts.js
```javascript
// 라우터에 delete매서드를 통해 해결할 수 있다. delete매서드를 shortId를 통해 요청하여 path parameter(req.params)로 받는다. shortId를 통해 delete함수를 구현한다.
// Post에 delete함수를 이용해서 shortId를 찾아서 delete 기능을 구현한다. 삭제된 게시글은 목록에서 보이지 않게 된다. 

const {Post} = require('./models');
...
router delete('/:shortId', async(req,res,next)=>{
    const {shortId} = req.params;
    try {
        await Post.delete({shortId});
        res.send('OK');
    } catch(err){
        next(err);
    }
});
...
```

```javascript
```

```javascript
```

```javascript
```


####
#####