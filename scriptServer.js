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


const mysql = require('mysql2');


const connection = mysql.createConnection({         //создает соединения
    host: 'localhost',
    user: 'root',
    database: 'data'
});

function sqlQuery(sql, add) {
    return new Promise ((resolve, reject) => {
        connection.query(sql, add, (err, result) => {
            if (err) {
                return reject(err);
            }
            return  resolve(result);
        })
    })
}


//есть ли такой логин в массиве
function threreIsSuchUser(trueLogin) {
    // let whatWeSearch="SELECT * FROM `users` WHERE `login` = '" + trueLogin + "'";
    return sqlQuery("SELECT * FROM `users` WHERE `login` = ? ", [ trueLogin])
        .then(list => {
            if (list.length === 1) {return list[0]}
             else {return false}
        })
}

function getUserList(){
    return sqlQuery('SELECT * FROM users')
}


//есть ли такой айди в массиве
function threreIsSuchId(trueID) {
    // let whatWeSearch='SELECT * FROM `users` WHERE `login` = ' + "'" + trueLogin + "'";
    return sqlQuery("SELECT * FROM `users` WHERE `id` = ? ", [ trueID])
        .then(list => {
            if (list.length === 1) {return list[0]}
            else {return false}
        })
}

//вспомогательная функция для удаления из массива пользователя
function deleteUserById(id) {
    return sqlQuery('DELETE FROM `users` WHERE `id` = ' + Number(id));
}

//вспомогательная функция по добавлению поьзователя в SQL
function addNewUser(name, login, password) {
    let salt = bcrypt.genSaltSync(10);
    let newPassword = password + salt;
    return sqlQuery('INSERT INTO `users` (name, login, password, userSalt) VALUES (?, ?, ?, ?)', [name, login, makeHash(newPassword), salt])
}


//вспомогательная функция для изменения пароля пользователя
function changePasswordById(id, inputPassword) {
    let index = Number(id);
    return threreIsSuchId(index).then(user => {
        let newPassword = inputPassword + user.userSalt;
        return user.password = makeHash(newPassword)
        }).then(password => {
            console.log(password);
            console.log( sqlQuery("UPDATE  `users` SET `password` = ? WHERE `id` = " + index, [password]) );
             return sqlQuery("UPDATE `users` SET `password` = ? WHERE `id` = " + index, [password])
        });
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
        if (elem === null) return elem = "Некорректный Ip";
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



///////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/ajax/users.json/checkuser', function(req, res, next) {
    let nameUser = req.body.login;
    let passwordUser = req.body.password;
    threreIsSuchUser(nameUser).then((checkingUser)=>{
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

    })

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
    getUserList().then(userList => {
        res.json(userList);
    })
});


//удаление пользователей из списка json
app.post('/ajax/users.json/delete', function(req, res, next) {
        deleteUserById(req.body.id);
        res.json({success:1});
});


//изменение пароля у пользователя
app.post('/ajax/users.json/changepassword', function(req, res, next) {
    if (req.body.password === req.body.repeatPassword) {
        changePasswordById(req.body.id, req.body.password).then(() => {
            res.json({success: 1});
        })
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
    const promiseResult = threreIsSuchUser(login);
    promiseResult.then(function(loginInput) {
        if (Boolean(loginInput) === false) {
            addNewUser(name, login, password)
                .then(addUser => {
                    res.json(addUser);
                })
        }
        else {
            return next(createError(400, 'Такой логин уже занят'))
        }
    }).catch(function(err){
        next(err)               //отлавливается только при ошибке в булевом false
    })
});


//запоминание имени
app.get('/ajax/users.json/name', function (req, res) {
    let pretoken=req.headers.authorization;
    let trueToken=pretoken.split(" ")[1];
    let decodedId = jwt.verify(trueToken, secretWord).id;
    threreIsSuchId(decodedId).then(user => {
        res.json({name: user.name, login: user.login});
    });
});




//получение списка файлов
app.get('/ajax/users.json/files', function (req, res) {
    const files = fs.readdirSync(directory);    //Прочитываем файлы из текущей директории
    const filesWithoutEnd=files.map(function(elem) {  //второй способ
        return path.basename(elem, path.extname(elem))
    });
    let arrayIP=findIp(filesWithoutEnd);
    let result=makeObjFileWithIp(filesWithoutEnd, arrayIP);
    res.json({files:result});
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

