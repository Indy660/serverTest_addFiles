//Подключение модулей
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
    app.set('views', __dirname + '/views');   //указывает путь к шаблонам
    app.set('view engine', 'ejs');            //шаблонизатор, какое расширение
    app.use(express.static('public'));  //статичные объекты, в том числе и скрипт для клиента
const url = require('url');
const cors=require('cors');
    app.use(cors());
const bodyParser = require('body-parser');   //для пост запросов
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
const createError = require('http-errors');

const directory="C:\\Users\\User\\Desktop\\Работа\\serverTest_addFiles\\experimentFolder";


//добовляет файлы которые на компьютере для загрузки если они имеются
app.use(express.static(path.join(__dirname, 'public')));

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

//страница проверки данных для входа
app.get('/ajax/enter', function (req, res) {
    let login = req.query.login;
    let password = req.query.password;
    const result=threreIsSuchUser(userList, login);
    if (result && password===result.password) {
        const out = {
            success: 1,
            name: result.name,
            user: result.id
        };
        res.json(out)            //отправляю json формат на клиент
        //res.type('json')       //тоже самое
        //res.send(JSON.stringify(out)) //тоже самое
    }
    else if (result&&password!==result.password) {
        let message="Вы ввели неправильно пароль!";
        res.json({success:0, message})           //отправляю json формат на клиент
    }
    else {
        //???????????????????????????????????
        let message="Такого пользователя не существует!";
        res.json({success:0, message})
    }
 });

//страница json массива
app.get('/ajax/users.json', function (req, res) {
    res.json(userList);
});


//удаление пользователей из списка json
app.post('/ajax/users.json/delete', function(req, res, next) {
    deleteUserById(req.body.id, userList);
    res.json({
        user_id: req.body.id
    });
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
        //???????????????????????????????????
        res.json({
            message:console.log("Такой пользователь уже есть")
        })
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



