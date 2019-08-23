//Подключение модулей
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.set('views', __dirname + '/views');   //указывает путь к шаблонам
app.set('view engine', 'ejs');
app.use(express.static('public'));  //статичные объекты, в том числе и скрипт для клиента
const url = require('url');

const directory="C:\\Users\\User\\Desktop\\Работа\\serverTest_addFiles\\experimentFolder";


//добовляет файлы которые на компьютере для загрузки если они имеются
app.use(express.static(path.join(__dirname, 'public')));


//Главная страница
app.get('/', function (req, res) {
    const files = fs.readdirSync(directory);    //Прочитываем файлы из текущей директории
    //первый способ
    // const filesWithoutEnd=files.map(function(elem) {
    //     return path.parse(elem).name
    // });
    const filesWithoutEnd=files.map(function(elem) {  //второй способ
        return path.basename(elem, path.extname(elem))
    });
    res.render('home', {value: filesWithoutEnd});  //генерация страниц 1-ый параметр шаблон
});


//  удаления файла из текущей директории
app.get('/del', function(req, res) {
    const folder = directory+"\\"+req.query.delFile;
    fs.unlink(folder, err => {
        console.error(err);
        res.send("200");    //выведем 200ок
    });
});

//вспомогательная функция для перезаписи файлов
function changeText(way, str1, str2) {
let oldText=fs.readFileSync(way, "utf8");
let domenWithoutDots=str1.replace(/\./g, "");
let newText=oldText.replace(/__DOMAIN__/g, str1).replace(/__DOMAINWITHOUTDOT__/g, domenWithoutDots).replace(/__IP_ADDRESS__/g, str2);
    return newText
}

//перезапись файла template.conf на выбранный файл
app.get('/addDomain', function(req, res){
    let domain = req.query.domain;
    let ip = req.query.ip;
    let template = directory +"\\" +"template.conf";
    let newFile=directory +"\\" +domain+".conf";
    fs.writeFile(newFile,  changeText(template, domain, ip), function(error){
        if(error) throw error;  //Использую инструкцию throw для генерирования исключения
        res.send("200");        //выведем 200ок
    });
});

//поиск файлов
app.get('/search', function(req, res){
    let searchWord = req.query.file;
    const files = fs.readdirSync(directory);
    let searchFiles = files.filter(function(elem) {
        if (elem.indexOf(searchWord) > -1) {
            return true;
    }
        else {return false}
    });
    res.render('home', { value: searchFiles});  //генерация страниц 1-ый параметр шаблон
});


//страница входа
app.get('/enter', function (req, res) {
    res.render('enter' );
});



// const userList = { id: 1, name: 'Admin', login: 'Admin', password:"qwe"}
// function threreIsSuchUser(list){
//     for (let id in list) {
//         alert(id)        // выводит ключи
//     }
// }

// const userList = { id: 1, name: 'Admin', login: 'Admin', password:"qwe"}
// function threreIsSuchUser(list){
//     for (let id in list) {
//         alert(list[id])        // выводит значения ключей
//     }
// }

const userList = [
    { id: 1, name: 'Admin', login: 'Admin', password:"qwe"},
    { id: 2, name: 'TestUser', login: 'test', password:"123"},
    { id: 3, name: 'Dima', login: 'DimaK', password:"12345"}
];

function threreIsSuchUser(list, trueLogin) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].login === trueLogin) {
            return list[i]
        }
    }
    return false
}



//страница проверки данных для входа
app.get('/ajax/enter', function (req, res) {
    let email = req.query.email;
    let password = req.query.password;
    const result=threreIsSuchUser(userList, email);
    if (result && password===result.password) {        //email как-будто равен логину
        const out = {
            success: 1,
            name: result.name,
            user: result.id
        };

        res.json(out)            //отправляю json формат на клиент
        //res.type('json')       //тоже самое
        //res.send(JSON.stringify(out)) //тоже самое
    }
    else if (result&&password!==result.password) {        //email как-будто равен логину
        let message="Вы ввели неправильно пароль!";
        res.json({success:0, message})           //отправляю json формат на клиент
        // 2) res.json({
        //     success:0,
        //     message: "Вы ввели неправильно пароль!"
        // })
        // 3) res.json({
        //     success:0,
        //     message: message
        // })
        //
        // 4) const out = {
        //     success:0,
        //     message: message
        // }
        // res.json(out)
        //
        // 5) const out = {
        //     success:0,
        //     message
        // }
        // res.json(out)        //все способы передать на клиент сообщение
    }
    else {
        let message="Такого пользователя не существует!";
        res.json({success:0, message})
    }
 });




app.listen(3000, function () {
    console.log('Отслеживаем порт: 3000!');
});


//только добавляла файлы с содержанием домэна и айди
// app.get('/addDomain', function(req, res){
//     let domain = req.query.domain;
//     let ip = req.query.ip;
//     let fileName = directory +"\\" +domain + '.conf';
//     let text='Domain ' + domain + '\n' + 'IP: ' + ip;   //текст внутри файла
//     fs.writeFile(fileName, text , function(error){
//         if(error) throw error;  //Использую инструкцию throw для генерирования исключения
//        fs.readFileSync(fileName, "utf8");
//         res.send("200");        //выведем 200ок
//     });
// });

//  добавление файла в текущую директорию
// app.get('/add', function(req, res){
//     let newFile = directory+"\\"+req.query.nameFile;
//     fs.writeFile(newFile,"Это пример текста!" , function(error){
//         if(error) throw error; //Использую инструкцию throw для генерирования исключения
//         res.send("200");//выведем 200ок
//     });
// });


