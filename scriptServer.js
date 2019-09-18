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

const fs = require('fs');
const path = require('path');
let directory="C:\\Users\\User\\Desktop\\Работа\\vue_cli_table\\experimentFolder";

let secretWord="Lox";



let userList = [
    { id: 1, name: 'Admin', login: 'Admin', password:"qwe"},
    { id: 2, name: 'Вика', login: 'test', password:"123"},
    { id: 3, name: 'Лёня', login: 'DimaK', password:"12345"},
    { id: 4, name: 'Саша', login: 'gundi5', password:"BF236BF"},
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

//вспомогательная функция для перезаписи файлов
function changeText(way, str1, str2) {
    let oldText=fs.readFileSync(way, "utf8");
    let domenWithoutDots=str1.replace(/\./g, "");
    let newText=oldText.replace(/__DOMAIN__/g, str1).replace(/__DOMAINWITHOUTDOT__/g, domenWithoutDots).replace(/__IP_ADDRESS__/g, str2);
    return newText
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
        if (elem === null) return elem="Некотректный Ip";
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

//объединение название файла и айпи а один объект   не достаточно хорошо
// function makeObjFileWithIp(arrayFile, arrayIp) {
//     let result = [];
//     filesWithIp = {};
//     for (let i = 0; i < arrayFile.length; i++) {
//         filesWithIp[arrayFile[i]] = arrayIp[i];
//         result.push(filesWithIp);
//     }
//     return result
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////






app.post('/ajax/users.json/checkuser', function(req, res, next) {
    let nameUser = req.body.login;
    let passwordUser = req.body.password;
    let checkingUser=threreIsSuchUser(userList, nameUser);
    if (checkingUser.password === passwordUser) {
        let token = jwt.sign({ login: nameUser, id:checkingUser.id }, secretWord);
        res.json({
            token:token,
            user_id: checkingUser.id,
            user_login: checkingUser.login,
            user_name: checkingUser.name,
        });
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
    res.json(userList);
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



//запоминание имени
app.get('/ajax/users.json/name', function (req, res) {
    let pretoken=req.headers.authorization;
    let trueToken=pretoken.split(" ")[1];
    let decodedId = jwt.verify(trueToken, secretWord).id;
    let nameUser = threreIsSuchId(userList, decodedId).name;
    res.json({name:nameUser});  //генерация страниц 1-ый параметр шаблон
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



