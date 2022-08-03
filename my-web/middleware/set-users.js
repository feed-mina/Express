const users = require('../data/users');
const admins = require('../data/admins');

// const setUser = ()=> {
//     (req, res, next) => {
//         const { userName } = req.query;
//         req.user = users[userName];
//         next();
//     }
// }


// const setUser = (type) => (req, res, next) => {
//         const { userName } = req.query;
//         if(type === "admin"){
//             req.user = admins[userName];
//         }else{
//             req.user = users[userName];
//         }
        
//         next();
//     }



const setUser = (type) => (req, res, next) => {
        const { userName } = req.query;
        if(type === "admin"){
            req.user = admins[userName];
            next(); //next함수 뒤에 return을 두어 if문을 종료시킨다.
            return;
        }
            req.user = users[userName];
            next();
        
    }

module.exports = setUser;