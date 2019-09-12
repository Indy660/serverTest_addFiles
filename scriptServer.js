//Подключение модулей
const express = require('express');
const app = express();
const cors=require('cors');
    app.use(cors());
const bodyParser = require('body-parser');   //для пост запросов
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

let secretWord="Lox";



let userList = [
    { id: 1, name: 'Admin', login: 'Admin', password:"qwe"},
    { id: 2, name: 'TestUser', login: 'test', password:"123"},
    { id: 3, name: 'Dima', login: 'DimaK', password:"12345"},
    { id: 4, name: 'Sacha', login: 'gundi5', password:"BF236BF"},
    { id: 5, name: 'Дима', login: 'Indy660', password: '123' }
];
let beginLengthArray=userList.length;

//есть ли такой логин в массиве
function threreIsSuchUser(list, trueLogin) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].login === trueLogin) {
            return list[i]
        }
    }
    return false
}

//есть ли такой айди в массиве
function threreIsSuchId(list, trueId) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === trueId) {
            return list[i]
        }
    }
    return false
}

//вспомогательная функция для удаления из массива пользователя
function deleteUserById(id, array){
    let index = Number(id);
    let userData=threreIsSuchId(array, index);
    let userIndexReal=userList.indexOf(userData);
    userList.splice(userIndexReal, 1);
}







app.post('/ajax/users.json/checkuser', function(req, res, next) {
    let nameUser = req.body.login;
    let passwordUser = req.body.password;
    let checkingUser=threreIsSuchUser(userList, nameUser);
    // console.log("nameUser:"+ nameUser+ "passwordUser:"+ passwordUser+ "checkingUser:"+ checkingUser)
    // console.log(checkingUser.password)
    if (checkingUser.password === passwordUser) {
        let token = jwt.sign({ login: nameUser, id:checkingUser.id }, secretWord);
        res.json({
            token:token,
            user_id: checkingUser.id,
            user_login: checkingUser.login,
            user_name: checkingUser.name
        });
    }
    else {
        return next(createError(400, 'Вы ввели неправильные данные для входа'))
    }
});


app.use(function(req, res, next) {
    let token=req.query.token||req.body.token;
    if (Boolean(token)===false) {
    return next(createError(404, 'Такого токена не существует'))
    }
    else {
        next()
    }
});



//страница json массива
app.get('/ajax/users.json', function (req, res) {
    res.json(userList);
});




//
//
// app.use(function(req, res, next) {
//     if (!token) { // приводим к булевному значению (то что токена не существует)
//         return next(createError(412, 'Токен не сушествует'))
//     }
//     let decoded = jwt.verify(token, MY_SECRET); // расшифруем токен
//     if (!decoded) {
//         return next(createError(416, 'Токен не валиден'))
//     } else next()
//
// });

//удаление пользователей из списка json
app.post('/ajax/users.json/delete', function(req, res, next) {
    let decoded = jwt.verify(req.body.token, secretWord);
    // console.log(req.body.token);
    // console.log(decoded)
    if (decoded) {
        deleteUserById(req.body.id, userList);
        res.json({
            user_id: req.body.id
        });
    }
});



//добавление пользователей в список json
app.post('/ajax/users.json/addUser', function(req, res, next) {
    let name = req.body.name;
    let login = req.body.login;
    let password = req.body.password;
    if (threreIsSuchUser(userList, login)===false) {
        const newUserArray = {id: ++beginLengthArray, name: name, login: login, password: password};
        userList.push(newUserArray);
        res.json({
            user_id: newUserArray.id
        });
    }
    else {
            return next(createError(400, 'Такой логин уже занят'))
        }

});




app.use(function(req, res, next) {
    return next(createError(404, 'Api метод не существует'))
});

app.use(function(err, req, res, next) {
    res.status(err.statusCode);
    res.json({
        success: 0,
        error:err,
        message: err.message
    })
});


app.listen(3000, function () {
    console.log('Отслеживаем порт: 3000!');
});



