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
    // console.log(files[0])
    // const filesWithoutEnd=path.basename(directory+files[0], path.extname(files[0]));
    res.render('home', { title: 'Directory', value: files});  //генерация страниц 1-ый параметр шаблон
});

//  добавление файла в текущую директорию
app.get('/add', function(req, res){
    let newFile = directory+"\\"+req.query.nameFile;
    fs.writeFile(newFile,"Это пример текста!" , function(error){
        if(error) throw error; //Использую инструкцию throw для генерирования исключения
        res.send("200");//выведем 200ок
    });
});


//  удаления файла из текущей директории
app.get('/del', function(req, res) {
    const folder = directory+"\\"+req.query.delFile;
    fs.unlink(folder, err => {
        console.error(err);
        res.send("200");    //выведем 200ок
    });
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

//вспомогательная функция
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



app.listen(3000, function () {
    console.log('Отслеживаем порт: 3000!');
});


// path.basename(p[, ext])
//
// path.extname(p)

// path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// path.basename('/foo/bar/baz/asdf/quux.html', path.extname());
// // Returns: 'quux'

//basename
//extname path
