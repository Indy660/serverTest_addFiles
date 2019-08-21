//Подключение модулей
const express = require('express');
const path = require('path');
const fs = require('fs')
const app = express();
const directory="C:\\Users\\User\\Desktop\\Работа\\serverTest_addFiles\\experimentFolder";
app.set('views', __dirname + '/views');   //указывает путь к шаблонам
app.set('view engine', 'ejs');
app.use(express.static('public'));  //статичные объекты, в том числе и скрипт для клиента
const url = require('url')


//добовляет файлы которые на компьютере для загрузки если они имеются
app.use(express.static(path.join(__dirname, 'public')));

//Главная страница
app.get('/', function (req, res) {
    const files = fs.readdirSync(directory);    //Прочитываем файлы из текущей директории
    res.render('home', { title: 'Directory', value: files}); //генерация страниц 1-ый параметр шаблон
});


app.get('/add', function(req, res){
    let domain = directory+"\\"+req.query.newFile;
    fs.writeFile(domain,"Это пример текста!" , function(error){
        if(error) throw error; //Использую инструкцию throw для генерирования исключения
        res.send("200");//выведем 200ок
    });
});


//  удаления файла из текущей директории
app.get('/del', function(req, res) {
    const folder = directory+"\\"+req.query.delFile;
    fs.unlink(folder, err => {
        console.error(err)
    });
    res.send("200");//выведем 200ок
});


app.listen(3000, function () {
    console.log('Отслеживаем порт: 3000!');
});




