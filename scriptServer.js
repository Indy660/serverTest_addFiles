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

const fs = require('fs');
const path = require('path');
let directory="C:\\Users\\User\\Desktop\\Работа\\vue_cli_table\\experimentFolder";

// const md5 = require('js-md5');
const { SHA3 } = require('sha3');//модуль хеширования SHA3



const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';        //добавление соли

// const mariadb = require('mariadb');   //на данный момент модуль марияДб не нужна
// const pool = mariadb.createPool({host: 'localhost', user: 'root', connectionLimit: 5});         //создает соединения

const mysql = require('mysql2');




let userList = [
    { id: 1, name: 'Админ', login: 'Admin', password:"400e55df78250581081a47492add062beace301ab6103cb0724cf18fac391011", userSalt:"$2b$10$uq/86WYjCG/JDNv3hzQE3e"},
    { id: 2, name: 'Вика', login: 'test', password:"70b0f1e89c2a76f250c4fa45539647c99b92d82bde7b13f830a2378a52868a2c", userSalt:"$2b$10$uq/86WYjCG/JDNv3hzQE3e"},
    { id: 3, name: 'Лёня', login: 'DimaK', password:"8dd2c1beef781a5bd3675f266780968405410637565a6992100a1dd8d169ff16", userSalt:"$2b$10$iAd79yW.SRFY4/kFGxn/Me"},
    { id: 4, name: 'Саша', login: 'gundi5', password:"a557531e9960e0aa553abad2f1f1dfe583bab1236c4c764d6940832ddd729ee7", userSalt:"$2b$10$slw5uWC5bIuVP/L4vLQeJe"},
    { id: 5, name: 'Дима', login: 'Indy660', password: '669ddcb29fbb19ec084a0d776ab9dd52160212bb25b80ee8729d30fe5988c30f', userSalt:"$2b$10$J8GeQISFzZnjYxJFfG.P9e" }
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
function deleteUserById(id, array) {
    let index = Number(id);
    let userData = threreIsSuchId(array, index);
    let userIndexReal = array.indexOf(userData);
    array.splice(userIndexReal, 1);
}

//вспомогательная функция для изменения пароля пользователя
function changePasswordById(id, array, inputPassword) {
    let index = Number(id);
    let userData = threreIsSuchId(array, index);
    let newPassword = inputPassword + userData.userSalt;
    userData.password = makeHash(newPassword);
    // console.log(newPassword+"+++"+userData.password)
}

//вспомогательная функция для перезаписи файлов
function changeText(way, str1, str2) {
    let oldText=fs.readFileSync(way, "utf8");
    let domenWithoutDots=str1.replace(/\./g, "");
    return oldText.replace(/__DOMAIN__/g, str1).replace(/__DOMAINWITHOUTDOT__/g, domenWithoutDots).replace(/__IP_ADDRESS__/g, str2);
}

//вывод айпи из файла
function findIp(way) {
    let arrayIP=[];
    for (i = 0; i < way.length; i++) {
        let string = fs.readFileSync(directory+"\\"+way[i]+".conf", "utf8");
        let ip = string.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g);
        arrayIP.push(ip);
    }
    let finalIp = arrayIP.map(function(elem) {
        if (elem === null) return elem="Некорректный Ip";
        else {return elem.join()}
    });
    // console.log(finalIp);
    return finalIp
}

//объединение название файла и айпи а один объект
function makeObjFileWithIp(arrayFile, arrayIp) {
    let result = [];
    for (let i = 0; i < arrayFile.length; i++) {
        let obj={};
        obj.domain=arrayFile[i];
        obj.ip= arrayIp[i];
        result.push(obj)
    }
    return result
}

//функция создания хэша по SHA3 с размером 256
function makeHash(word) {
    const hash = new SHA3(256);
    hash.update(word);
    return hash.digest('hex');      //функция хэширования, hex-10 тичная система
}




const connection = mysql.createConnection({         //создает соединения
    host: 'localhost',
    user: 'root',
    database: 'data'
});

function sqlQuery(sql) {
    return new Promise ((res, rej) => {
        connection.query(sql, (err, a) => {
            if (err) {
                return rej(err);
            }
            return  res(a);
        })
    }).then(rows => {return (rows)})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////




app.post('/ajax/users.json/checkuser', function(req, res, next) {
    let nameUser = req.body.login;
    let passwordUser = req.body.password;
    let checkingUser = threreIsSuchUser(userList, nameUser);
    if (Boolean(checkingUser)) {
        let newPassword = passwordUser + checkingUser.userSalt;
        if (checkingUser.password === makeHash(newPassword)) {
            let token = jwt.sign({ login: nameUser, id:checkingUser.id }, secretWord);
            res.json({
                token:token,
                user_id: checkingUser.id,
                user_login: checkingUser.login,
                user_name: checkingUser.name,
            });
        }
        else {
            return next(createError(400, 'Вы ввели неправильный пароль'))
        }
    }
    else {
        return next(createError(400, 'Вы ввели неправильные данные для входа'))
    }
});


app.use(function(req, res, next) {      ///обрабатывает все запросы, где нету правильной авторизации
   let pretoken=req.headers.authorization;
   if (Boolean(pretoken) === false) {
       return next(createError(404, 'Такого токена не существует'))
   }
    let trueToken=pretoken.split(" ")[1];
    let decoded = jwt.verify(trueToken, secretWord);
    // console.log(decoded)
    if (!decoded) {
        return next(createError(404, 'Токен не валидный!'))
    }
    else {
        next()
    }
});



//страница json массива
app.get('/ajax/users.json', function (req, res) {
    sqlQuery('SELECT * FROM users').then(userList => {
        res.json(userList);
    })
});


//удаление пользователей из списка json
app.post('/ajax/users.json/delete', function(req, res, next) {
    // let decoded = jwt.verify(req.body.token, secretWord);
    // console.log(req.body.token);
    // console.log(decoded)
    // if (decoded) {           //после authorization данная проверка не нужна
        deleteUserById(req.body.id, userList);
        res.json({success:1});
    // }
});


//изменение пароля у пользователя
app.post('/ajax/users.json/changepassword', function(req, res, next) {
    if (req.body.password === req.body.repeatPassword) {
        changePasswordById(req.body.id, userList, req.body.password);
        // console.log(req.body.id, req.body.password);
        res.json({success: 1});
    }
    else {
        return next(createError(400, 'Пароли должны совпадать'))
    }
});


//добавление пользователей в список json
app.post('/ajax/users.json/addUser', function(req, res, next) {
    let name = req.body.name;
    let login = req.body.login;
    let password = req.body.password;
    if (threreIsSuchUser(userList, login)===false) {
        let salt = bcrypt.genSaltSync(10);
        let newPassword=password+salt;
        // console.log(salt+"+++++++"+newPassword);
        const newUserArray = {id: ++beginLengthArray, name: name, login: login, password: makeHash(newPassword), userSalt: salt};
        // console.log(newUserArray);
        userList.push(newUserArray);
        res.json({
            user_id: newUserArray.id
        });
    }
    else {
        return next(createError(400, 'Такой логин уже занят'))
    }
});



//запоминание имени
app.get('/ajax/users.json/name', function (req, res) {
    let pretoken=req.headers.authorization;
    let trueToken=pretoken.split(" ")[1];
    let decodedId = jwt.verify(trueToken, secretWord).id;
    let nameUser = threreIsSuchId(userList, decodedId).name;
    let nameLogin = threreIsSuchId(userList, decodedId).login;
    res.json({name:nameUser, login:nameLogin});  //генерация страниц 1-ый параметр шаблон
});




//получение списка файлов
app.get('/ajax/users.json/files', function (req, res) {
    const files = fs.readdirSync(directory);    //Прочитываем файлы из текущей директории
    const filesWithoutEnd=files.map(function(elem) {  //второй способ
        return path.basename(elem, path.extname(elem))
    });
    // console.log(filesWithoutEnd);
    let arrayIP=findIp(filesWithoutEnd);
    let result=makeObjFileWithIp(filesWithoutEnd, arrayIP);
    res.json({files:result});//генерация страниц 1-ый параметр шаблон
    // console.log(result)
});



//перезапись файла template.conf на выбранный файл
app.post('/ajax/users.json/addFiles', function(req, res){
    let domain = req.body.domain;
    let ip = req.body.ip;
    let template = directory +"\\" +"template.conf";
    let newFile=directory +"\\" +domain+".conf";
   fs.writeFile(newFile,  changeText(template, domain, ip), function(error){
       if(error) throw error;
    res.json({success:1});
   })
});


//  удаления файла из текущей директории
app.post('/ajax/users.json/delFiles', function(req, res) {
    const folder = directory + "\\" + req.body.delFile + ".conf";
    // console.error(folder);
    fs.unlink(folder, err => {
        console.error(err);
    res.json({success:1});
    })
});


app.use(function(req, res, next) {
    return next(createError(404, 'Api метод не существует'))
});

app.use(function(err, req, res, next) {
    res.status(err.statusCode || 500);
    res.json({
        success: 0,
        error:err,
        message: err.message
    })
});


app.listen(3000, function () {
    console.log('Отслеживаем порт: 3000!');
});



