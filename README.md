 
##### Express.js는 Node.js의 웹 프레임워크 중 가장 유명한 웹 프레임워크이다. 
##### 필요에 따라 유연하게 구조설정 가능 
##### 다양한 미들웨어를 통해 필요한 기능을 간단하게 추가 가능, 모든 동작이 명시적으로 구성되기 때문에
##### 웹프레임워크의 동작방식을 이해하기 가장 좋은 프레임워크이다.

#### Express.js를 처음부터 작성할 수 있는 방법

```javascript
npm init
npm install express
npm i - g express-generator
express my-web
cd my-web
npm install
npm start
```

#### express-generator라고 하는 프로젝트 생성기를 제공한다. 
##### 프로젝트의 기본구조를 자동으로 생성해줌, 빠르게 프로젝트를 시작하기 좋은 방법
##### 생성된 프로젝트는 npm start 로 시작 할 수 있음
##### npx를 사용하여 express-generator를 사용 할 수 있음 npx express-generator my-web
 

### Express 구조
#### app.js : Express.js 의 가장 기본이 되는 파일 ,웹 어플리케이션의 기능을 저으이
#### bin/www : Express.js 실행 부분을 담당, 포트와 실행 오류등을 정의
#### package.json 프로젝트 의존성 및 스크립트 정의
#### public : 코드를 통하지 않고 , 직접 제공되는 파일 디렉터리
#### routes : 라우팅 파일 디렉터리
#### vies : HTML Template 디렉터리

### Express.js 동작방식
#### express-generator 로 만들어진 프로젝트 디렉터리에 접근, npm start로 Express.js 로 프로젝트를 실행할 수 있음 
#### localhost:3000에 들어가면 express.js 가 실행 가능
#### 1. 브라우저에서 localhost:3000 접속
#### 2. app.js에서는 express()로 생성되는 app객체를 확인할 수 있음
#### 3. app 객체는 Express 기능을 담음 객체 모든 동작은 app객체에 담는다.
 

#### app.use() : middleware를 사용하기 위한 함수
#### http 서버를 생성해주는 함수, express-generator를 사용하면 http.createSever를 사용하는데 app.listen 함수로 대체할 수 있음
#### app.locals app에서 사용할 공통 상수, Express.js에서는 global변수를 선언하지 않고 이 값을 사용할 수 있음

### 라우팅
#### app 라우팅과 Express.Router 를 통한 라우팅으로 나누어진다.

#### app 라우팅 : app 객체에 직접 get, post, put, delete 함수를 사용하여 HTTP method로 라우팅 할 수 있음
#### HTTP method 함수의 첫번째 인자가 이 라우팅을 실행할 URL
#### 마지막 인자가 이 라우팅이 실행될때 사용하는 함수, all 함수를 사용하면 HTTP method에 상관없이 라우팅 가능

```javascript
app,get('/',(req,res)=>{
    res.send('GET /');

})
app.post('/',(req,res)=>{
    res.send('POST /');
});
app.put('/',(req,res)=>{
    res.send('PUT /');
})
app.delete('/',(req,res)=>{
    res.send('DELETE /');
})
app.all('/all', (req,res)=>{
    res.send('ANY /');
})

```

#### app 라우팅을 통해서는 라우팅의 핵심인 그룹화를 지원하지 않음 -> Express.Router를 통해 라우팅을 모듈화 할 수 있음 
```javascript
const express = require('express');
const router = express.Router();

router.get('/',(req,res,next) => {
    res.send('respond with a resource');
})
module.exports = router ; 

```
#### router 객체에도 app 객체처럼 get,put,post,delete 함수를 사용할 수 있음 , app의 함수와 동일한 동작을 하는 함수로 
#### 첫번째 인자가 라우팅 될 URL이고, 마지막 인자가 라우팅 시 실행될 함수, 라우터는 일반적으로 모듈로 만들어서 사용함 

```javascript
const userRouter = require('./routes/users');
const app = express();
app.use('/users', userRouter);

const petRouter = require('./pets')
const router = express.Router()
router.get('/pets',petRouter);
module.exports = router;
```
#### 작성된 라우터 모듈을 app에 use 함수로 연결하여 사용 할 수 있음, router 객체에도 하위 라우터를 use함수로 연결하여 사용할 수 있음 
#### Express.js라우팅은 path parameter를 제공, path parameter를 사용하면, 주소의 일부를 변수처럼 사용할 수 있음
#### ex) /users/:id-, users/123 , users/456 등으로 접속했을때 라우팅 적용
### Request Handler
#### 라우팅에 적용되는 함수를 Request Handler라고 부름 
#### HTTP 요청과 응답을 다룰 수 있는 함수로 설정된 라우팅 경로에 해당하는 요청이 들어오면 Request Handler함수가 실행됨
#### router나 app의 HTTP method함수의 가장 마지막 인자로 전달되는 함수 
#### 설정된 라우팅 경로에 해당하는 요청이 들어오면 Request Handler 함수가 실행됨 
#### 요청을 확인하고, 응답을 보내는 역할을 함
#### Request 객체 : HTTP 요청 정보를 가진 객체, HTTP요청의 path parameter, query paremeter, body, header등을 확인 가능 
```javascript
router.get('/:id',(req,res)=>{
    const id = req.perams.id
    res.send(`hello ${id}`);
})
```

### path parameter 사용하기
```javascript
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("OK");
});

// path parameter 사용하기
app.get('/say/:greeting', (req, res) => {
    const { greeting } = req.params;
    res.send(greeting);
});

app.listen(8080);
```


### Request Handler-request 객체의 주요 값 및 함수
#### req.params: URL표현 중 /path/:id 에서 :id를 req.params.id로 사용할 수 있음
#### req.queries : URL 표현 중 /path>page=2 에서 page부분을 req.queries.page로 사용 할 수 있음
#### req.body : 일반적으로 POST 요청의 요청 데이터를 담고 있음, req.body 에 요청 데이터가 저장되어 들어옴
#### req.get('') : HTTP Request의 헤더 값을 가져 올 수 있음 req.get('Authorization') 등으로 값을 가져옴 

### Request Handler -response : HTTP 응답을 처리하는 객체, HTTP응답의 데이터를 전송하거나, 응답 상태 및 헤더를 설정할 수 있음 
#### res.send() : text형식의 HTTP 응답을 전송함
#### res.json() : json 형식의 HTTP 응답을 전송함
#### res.render() : HTML Template을 사용하여 화면을 전송함
#### res.set() : HTTP 응답의 헤더를 설정함
#### res.status() : HTTP 응답의 상태값을 설정함 

### Express.js 동작 방식 정리
#### Express.js 는 app 갞체를 시작으로 모든 동작이 이루어짐
#### app 객체나 Express.Router를 사용하여 라우팅을 구현할 수 있음
#### Request Handler를 통해 HTTP 요청과 응답을 처리할 수 있음


### Middleware 이해하기
#### 미들웨어는 Express.js 의 동작의 핵심 : HTTP 요청과 응답 사이에서 단계별 동작을 수행해주는 함수 
#### Express.js의 미들웨어는 HTTP 요청이 들어온 순간부터 시작이 됨, 미들웨어는 HTTP 요청과 응답객체를 처리하거나 다음 미들웨어를 실행할 수 있음
#### HTTP응답이 마무리 될때까지 미들웨어 동작 사이클이 실행됨
##### HTTP 요청 ==> Miidleware => Miidleware => Miidleware => Miidleware ... => Miidleware => Miidleware  ==>  HTTP 응답


### Middleware 작성과 사용
#### req, res, next를 가진 함수를 작성하며 해당 함수는 미들웨어로 동작할 수 있음
#### req : HTTP 요청을 처리하는 객체, res : HTTP 응답을 처리하는 객체
#### next : 다음 미들웨어를 실행하는 함수 

#### 미들웨어와 라우터 핸들러
##### Route Handler도 미들웨어의 한 종류 , Route Handler는 라우팅 함수 (get,post,put,delete) 에 적용된 미들웨어
##### 일반적인 미들웨어와는 다르게 path paremeter를 사용할 수 있음

#### middleware 작성법 
##### req, res, next를 인자로 갖는 함수를 작성하면 미들웨어가 됨, req, res객체를 통해 HTTP 요청과 응답을 처리하거나 
##### next 함수를 통해 다음 미들웨어를 호출해야함
##### next() 함수가 호출되지 않으면 미들웨어 사이클이 멈추기 때문에 주의 !
```javascript
const logger = (req,res,next) => {
    console.log(`Request ${req.path)`);
    next()
}

const auth = (req,res,next) => {
   if(!isAdmin(req)){
     res.send("Not Authorized");
     return;
     }
   next();
 }
```



#### 미들웨어는 적용되는 위치에 따라서 어플리케이션 미들웨어, 라우터 미들웨어, 오류처리 미들웨어로 나뉜다.
#### 어플리케이션 미들웨어
##### use 나 http method 함수를 사용하여 미들웨어를 연결할 수 있음, 미들웨어를 모든 요청에 공통적으로 적용하기 위한 방법,
##### HTTP 요청이 들어온 순간부터 적용된 순서대로 동작함


```javascript
app.use((req, res, next)=>{
    console.log(`Request ${req.path}`);
    next();
})

app.use(auth);

app.get('/', (req, res, next)=>{
    res.send('Hello Express');
})
```

#### 라우터 미들웨어
##### rotuer 객체에 미들웨어가 적용되는 것 외에는 어플리케이션 미들웨어와 사용방법은 동일
##### 특정경로의 라우팅에만 미들웨어를 적용하기 위한 방법
##### app 객체에 라우터가 적용된 이후로 순서대로 동작함

```javascript
router.use(auth); //3번째
router.get('/',(req,res,next) =>{
    res.send('Hello Router');
}); //4번째

app.use((req, res, next)=>{
    console.log(`Request ${res.path}`);
    next();
}) // 첫번째
app.use('/admin', router); //두번째
```

#### 미들웨어 서브스택
##### use 나 http method함수에 여러개의 미들웨어를 동시에 적용할 수 있음
#####  주로 한 개의 경로에 특정해서 미들웨어를 적용하기 위해 사용
##### 전달된 인자의 순서 순으로 동작

```javascript
 app.use(middleware1, middleware2, ...);
 app.use('/admin', auth, adminRouter);
 app.get('/', logger, (req,res,next)=>{
    res.send('Hello Express');
 })
```
#### 오류처리 미들웨어
##### 오류처리 미들웨어는 일반적으로 가장 마지막에 위치하는 미들웨어
##### 다른 미들웨어들과 달리 err,req,res,next 네가지 인자를 가지며 앞서 미들웨어에서 next함수에 인자가 전달되면 실행됨

```javascript
app.use((req,res,next) =>{
    if(!isAdmin(req)){
        next(new Error('Not Authorized'));
        return; //첫번째
    }
    next()
});

app.get('/', (req, res, next) => {
    res.send('Hello Express');
})
app.use((err, req, res, next)=>{
    res.send('Error Occurred'); // 두번째
})
```
#### 가장 아래 적용된 err, req, res, next를 인자로 갖는 함수라 오류처리 미들웨어
#### 이전에 적용된 미들웨어 중 next 인자에 인자를 넘기는 경우 중간 미들웨어들은 뛰어넘고
#### 오류처리 미들웨어가 바로 실행됨

#### 함수형 middleware
##### 하나의 미들웨어를 작성하고 작동모드를 선택하면서 사용하고 싶을 경우 미들웨어를 함수형으로 작성하여 사용할 수 있음

##### ex ) API별로 사용자의 권한을 다르게 제한하고 싶은 경우 - 사용자 권한을 주는 api 1개에 종류별 미들웨어 여러개


```javascript
const auth = (memberType) => {
    return(req,res,next)=>{
        if(!checkMember(req, memberType)){
            next(new Error(`member not ${memberType}`));
            return;
        }
        next();
    }
}
app.use('/admin',auth('admin'),adminRouter);
app.use('/users',auth('member'),userRouter);
```
##### auth함수는 미들웨어 함수를 반환하는 함수, auth 함수 실행 시 미들웨어의 동작이 결정되는 방식으로 작성 됨
##### 일반적으로 동일한 로직에 설정값만 다르게 미들웨어를 사용하고 싶을 경우에 활용 됨 
##### Express.js 는 다양한 미들웨어들이 이미 만들어져 라이브러리로 제공

##### 미들웨어는 HTTP 요청과 응답 사이에서 동작하는 함수 req,res,next를 인자로 갖는 함수는 미들웨어로 동작할 수 잇음
##### app 혹은 router객체에 연결해서 사용 가능, next에 인자를 넘기는 경우 오류처리 미들웨어가 실행됨
##### 미들웨어에 값을 설정하고 싶은 경우는 함수형 미들웨어로 작성 가능


### REST API 이해하기  
#### REST + API : REST 아키텍쳐를 준수하는 웹 API, RESTfulAPI라고 부르기도 함
#### API : Application Programming Interface : 서비스나 프로그램 간에 미리 정해진 기능을 실행할 수 있도록 하는 규약, 운영 체제 API, 프로그램 언어 API, 웹 API등이 있음
#### REpresentational State Transfer
##### 웹에서 자료를 전송하기 위한 표현방법에 대한 아키텍쳐
##### REST를 정확하게 구현하기 위해서는 많은 제한조건이 있지만 기본적인 REST가이드를 따르면 조금 더 좋은 구조의 API를 구성할 수 있음

#### HTTP Method의 사용
##### REST API는 API의 동작을 HTTP method + 명사형 URL로 표현함
##### /posts라는 URL은 '게시글'이라는 자원을 가리킨다고 할때, GET-가져오기 ,POST- 새로 만들기, PUT = 수정하기, DELETE - 삭제하기의 HTTP method와 결합하여 API동작을 정의 

#### REST APU - URL 표현법 
##### REST API URL의 자원은 복수형으로 표현되며 하나의 자원에 대한 접근은 복수형 + 아이디를 통해 특정 자원에 접근함 /posts 는 '게시글 전체'를 칭하는 URL이라고 할때 /posts/1은 1번 게시글 이라는 자원을 표현함

#### REST API - 계층적 자원
##### REST API는 URL을 통해 자원을 계층적으로 표현함 , /users/1/posts라는 URL은 1번 유저의 게시글 전체를 뜻함


##### REST API는 REST 아키텍처를 준수하는 웹 API를 의미하며 , URL을 통한 자원의 표현 방법과 HTTP mehotd를 통한 API동작의 정의 할 수 있다.
 

### JSON
#### JSON - JavaScript Object Notation : 자바스크립트에서 객체를 표현하는 표현식으로 시작함 , 데이터를 표현하는 방법이 단순하고 이해하기 쉬워서 웹 API에서 데이터를 전송할때 표현식으로 주로 사용됨  
##### 웹 API는 기본적으로 데이터를 문자열로 전송하게 됨, 어떤 객체를 웹 API를 통해서 문자열로 전달하기 위해 JSON을 사용함

#### JSON 사용 방법 - Object
##### JSON에서 Object는 {"key":value}로 표현함, value에는 어떤 값이라도 사용될 수 있음 (문자열, 숫자, JSON 객체 등)

#### JSON 사용 방법 - Array
##### JSON 에서 Array는 [item1,item2]로 표현함, item에는 어떤 값이라도 사용될 수 있음 (문자열,숫자,JSON 객체 등) ex) ['first',{name:'bob'}]

### Express.js로 REST API구현하기
#### 데이터베읏 없이 Node.js 모듈 활용, 간단한 메모의 작성, 수정, 삭제, 확인 기능 API구현
#####

#### MVC 패턴 : 웹 서비스의 가장 대표적인 프로젝트 구성 패턴으로 프로젝트의 기능들을 어떻게 분리할지 에 대한 하나의 구성방법, Model-View-Controller를 구분하여 프로젝트 구조를 구성하는 것 
##### MVC패턴 - Model : 데이터에 접근하는 기능 또는 데이터 그 자체를 의미함, 데이터의 읽기, 쓰기는 Model을 통해서만 이루어지도록 구성해야함 
##### View : 데이터를 표현하는 기능을 의미함 , 주로 Controller에 의해 데이터를 전달받고 전달받은 데이터를 화면에 표시해주는 기능을 담당
##### Controller : Model을 통해 데이터에 접근 하여, 처리 결과를 View로 전달하는 기능을 의미함 웹 서비에서는 주로 라우팅 함수가 해당 기능을 수행함

##### Javascript의 Array함수 사용하여 데이터 처리 구현 , router와 route handler를 사용하여 Http 요청, 응답처리 구현, 오류처리 미들웨어를 사용하여 오류를 처리하는 방법 구현, 정의되지 않는 라우팅에 대해 404오류처리 구현]]

###### 메모 목록 구현하기 
```javascript
// models/note.js
let notes = [
    {
        id : 1,
        title: 'first note',
        content : 'My first note is here'
    }
]

export.list = () =>{
    //js array함수 메서드 중 list 함수는 메모 목록 안에서 메모의 id, title만 보내는 함수
    // map 함수는 하나씩 객체를 순환하며 그 객체를 변환해준다. 함수 인자 안의 값이 배열 목록 안에 들어가있는 요소이며 함수에서 return된 값이 변환된 값이 된다. 예시에서는 중괄호가 없을때 바로 return되는 특정을 살려서  object로써 return하고 있다.
    return notes.map(({id, title}) => ({
        id,
        title,
    }));
}
```
 
```javascript
// routes/notes.js
const { Router} = require('express');
const Note = require('../models/note');
const router = Router();
// 첫번째로 메모 목록을 가져오는 HTTP method 중 get을 사용하여 메모 목록을 보이게 한다. get이라는 http 매서드에 연결된 request handler는 Note에 list함수를 사용하여 노트 목록을 받아온다.  노트목록을 response의 json함수를 사용하여 전달한다.
router.get('/',(req,res,next)=>{
    const notes = Note.list();
    res.json(notes);
})
```

###### 메모 상세 구현하기
```javascript
// models/note.js
//note 모델 안에 get이라는 함수 는 id를 인자로 받아 전달받은 id와 같은 id가 있는지 찾는다. array 에서 find 함수 는 note목록을 돌면서 함수를 실행시켜 함수의 return값이 참인 결과를 return해주는 함수이다.
 // find 의 인자값으로 받는 note를 하나씩 돌면서 note의 id 와  전달받은 id 와 동일한 것이 있는지  찾는 함수이다. 만약에 동일한 값이 없다면 note는 undefiend가 결과로 나오며 undefined가 나오면 Eroor를 알린다.

exports.get = (id) =>{
    const note = notes.find(
        (note) => note.id == id
    );
    if(!note){
        throw new Error('Note not found');
    }
    return note;
}
```

```javascript
// routes/notes.js
// 라우터의 get이라는 http매서드에 path parmeter로 id를 받도록 구현 , 그리고 받은 req.params.id는 일반적으로 문자열로 받기 때문에 Number함수로 감싸 숫자형으로 바꾼다. 숫자형으로 변형된 note id를 Note의 get함수에 인자값으로 넣는다. 여기서 찾아진 note를 response의 json으로 응답을 보낸다. 에러가 발생하게 되면 catch를 사용하여 next함수에 전달한다.
router.get('/:id' , (req,res,next)=>{
    const id = Number(req.params.id);

    try{
        const note = Note.get(id);
        res.json(note);
    } catch(e){
        next(e);
    }
});
```
###### 메모 작성 구현하기
```javascript
// models/note.js
// note 모델 안에 create함수를 추가한다. create함수는 title 과 content를 인자로 받아서 새로운 목록을 생성하여 위에있는 가장 마지막 목록에 추가하는 함수이다. 이때 현재 있는 메모 마지막 값에 +1을 하여 메모를 생성하고 싶을때, 노트에 있는 가장 마지막 값을 받아서 (notes[notes.length -1]) id : lastID로 destructing (구조분해) 를 한다. 
// newNote 를 새로 만들때 id 값으로 lastId 값에 +1 를 하여 새로 값을 주고 전달받은 title , content를 객체안에 넣는다. 이렇게 해서 생성된 newNote를 note array 안에 push 함수의 인자로 넣어서 사용하면 가장 마지막값에 newNote 값을 넣어 array를 생성할 수 있다.

exports.create = (title, content) => {
    const {id : lastId} = notes[notes.length - 1];
    const newNote = {
        id: lastId + 1,
        title,
        content,
    };
    notes.push(newNote);
    return newNote;
}
```

```javascript
//routes/notes.js
// 작성 api는 자원을 생성하는 api이다. http 매서드를 post로 사용한다. post는 request의 body값으로 요청값을 받을 수 있다. 이 요청값에 title 과 content를 구조분해하여 Note의 create함수에 전달한다.
// Note의 crate 함수는 새로 생성된 값을 note로 전달을 해준다. 새로 생성된 note 값은 response의 json으로 응답을 한다.
router.post('/', (req,res,next) =>{
    const {title, content}= req.body;
    const note = Note.create(title, content);
    res.json(note);
})
```
###### 메모수정 구현하기
```javascript
//models/note.js
//note model 모듈 안에 update함수로 메모 수정기능을 구현한다.  update함수는 id, title, content를 인자로 받아 전달받은 id에 title, content를 찾는다. 전달받은 title, content를 찾기 위해 findIndex를 찾는다. findIndex함수는 조건에 받는 index가 찾아졌을때 조건에 맞는 index를 반환한다. index < 0은 index가 없다는 의미이다. index가 없다면 new Error를 보낸다. 
// 요소가 있을때 요소를 객체로 전달을 받고 note의 title 과 content를 변경하여, 각각 note.title = title , note.content = content로 받아 다시 notes 의 array 에 index의 note를 수정한다. 변경된 note를 return한다. 

exports.update = (id, title, content ) =>{
    const index = notes.findIndex(
        (note) => note.id === id
    );
if(index <0){
    throw new Error('Note not found for update');
}
const note = notes[index];
note.title = title;
note.content = content ;
note[index] = note;
return note
}

```


```javascript
//routes/notes.js
// 메모 수정 api는 자원수정을 하는 http 매서드인 put을 사용한다. put 매서드는 특정 자원을 가리키는 path paremeter을 추가로 한다. 여기서는 /:id 를 path paremeter로 사용한다. req.params.id 를 Number함수로 변환하여 id로 저장한다.   put http 매서드도 req.body를 사용하는데 body 에 전달된 title , content를 구조분해 (destructing)하여 Note의 update함수에 전달한다. Note의 update는 수정된 note 를 바꿔서 해당 note를 res.josn으로 전달한다. 
// update에서 id를 찾을수 없으면 catch에서 error을 전달하고, error을 next함수에 전달한다.

router.put('/:id',(req,res,next) => {
    const id = Number(req.params.id);
    const {title, content}= req.body;
    try{
        const note = Note.update(id, title, content);
        res.json(note);
    } catch(e){
        next(e);
    }
});
```
###### 메모 삭제 구현하기

```javascript
//models/note.js
// 메모 삭제를 구현하기 위해 note 모듈 안에 delete 함수를 사용한다.  delete함수는 id를 인자로 받아 id에 해당하는 메모가 있는지를 찾고 메모가 있다면 id에 해당하는 메모를 원래있떤 note배열에 제외를 한 다음 배열을 다시 생성한다. some함수는 특정조건에 맞는 요소가 있는지를 찾는 함수이다. 요소가 있다면 true, 요소가 없다면 false 가 나온다. 요소가 없다면 에러를 만든다. 해당하는 id를 제외한 목록을 만들기 위해 filter함수를 사용한다. filter함수는 앞에있는 배열에서(note)  뒤에 제공된 함수의 해당하는 참인 값인 요소만 남기는 함수이다. 여기서는 note 안에 id가 전달된 id와 같지 않은 값만 남기기 때문에 note.id와 전달된 id가 같은 값이라면 notes에서는 남지 않게 된다. (삭제된다) 삭제할때는 return 값을 따로 남기지 않아도 되기 때문에 return 값을 적지 않는다. 
exports.delete = (id) =>{
    if(!notes.some((note) => note.id === id)){
        throw new Error(
            'Note not found for delete'
        );
    }
    notes = note.filter(note => note.id !== id);
    return;
}
```

```javascript
//routes/notes.js
// 자원을 삭제를 위해 delete http 매서드를 사용한다. delete http 매서드를 사용해서 자원을 표현하는 path parameter를 사용한다. 여기서 path parameter는 /:id 이다.  path paremeter을 req.params.id로 받아서 Number로 변환하여 id에 저장한다. (id변수로 선언한다.) id 변수를 Note.delete에 전달하고 만약에 문제가 없이 함수가 종료가 된다면 result : 'success'를 json의 응답으로 변수를 보낸다. 만약에 삭제할때 에러가 생긴다면 catch에서 걸리게 될것이고 catch에서 next함수에 error을 보낸다. 
// req.params.id 
router.delete('/:id',(req, res, next)=>{
    const id = Number(req.params.id);
    try{
        Note.delete(id);
        res.json({result : 'success'});
    } catch(e){
        next(e)
    }
});
```

#### JSON 데이터 처리 미들웨어 사용하기
##### express.js는 기본적으로 HTTP body에 전달되는 JSON 데이터를 처리하지 못함. index.js에서 express에서 기본적으로 제공하는 express.json() 미들웨어를 사용해야 JSON 데이터를 사용할 수 있음


```javascript
//index.js
app.use(express.json());
```
#### 오류 처리 미들웨어 구현하기
##### 가장 마지막 미들웨어로 오류 처리 미들웨어를 적용하면 모든 라우팅에 공통적인 오류 처리 로직을 적용할 수 있음


```javascript
//index.js
app.use((err, req, res, next) => {
    res.status(500);
    res.json({
        result : 'fail',
        error: err.message,
    })
});
```

### 정의되지 않은 라우팅에 404 오류 처리하기
##### 모든 라우팅이 적용된 이후에 사용되는 미들웨어는 설정된 경로가 없는 요청을 처리하는 Route Handler로 동작함 Express.js는 기본적인 404 페이지를 가지고 있지만 직접 처리가 필요한 경우 이와 같은 Route Handler를 추가해야 함
```javascript
//index.js
app.use((req, res, next) => {
    res.status(404);
    res.json({
        result : 'fail',
        error: `page not found ${req.path}`,
    });
});
```

### postman API를 사용하여 api를 테스트하기
####
####
####




```javascript
```


```javascript
```
