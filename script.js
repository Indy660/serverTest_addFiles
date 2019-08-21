const express = require('express');
const path = require('path');
const fs = require('fs')
const app = express();
const directory="C:\\Users\\User\\Desktop\\Работа\\serverTest\\experimentFolder";
// app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');   //указывает путь к шаблонам
app.set('view engine', 'ejs');


app.use(express.static('public'));  //статичные объекты, в том числе и скрипт для клиента


const array=["Первый", "Второй", 3, "Четвертый", 5, 6, 7, 8, 9, 10];



function arrayToString(value){
    let result="";
    for (let i=0; i<value.length; i++) {
        if(i!== 0) result+="<br>";
        result+=value[i]
    }
    return result
}           //преобразует массив в строку, а потом в список

function arrayToStringAndToUl(string) {
    let result="";
    for (let i=0; i<string.length; i++) {
        if(i!== 0) result+="</li><li>";
        result+=string[i]
    }
    return "<ul><li>"+result+"</li></ul>"
}           //преобразует массив в строку, а потом в упорядоченный список

function deleteArrayIndex (arr,j) {
   arr.splice(j-1,1);
}

function deleteArrayWord(arr,j) {
    let index = arr.indexOf(j);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

function sortArray(arr) {
    arr.sort()
}


app.get('/superspesh', function (req, res) {
    const fullPath = path.join(__dirname,'index.html');
    console.log(fullPath);
    res.sendFile(fullPath)
});

app.get('/sort', function (req, res) {
    let words="";
    sortArray(array);                     //если есть sort, то запускаем эту функцию
    words=arrayToStringAndToUl(array);
    res.send(words)
});

app.get('/add', function (req, res) {
    let item = req.query.value;
    let words="";
    array.push(item);                     //если есть add?value, то пушим в массив и запускаем его
    words=arrayToStringAndToUl(array);
    res.send(words)
});

app.get('/del', function (req, res) {
    let indexDelete = req.query.i;
    let valueDelete = req.query.value;
    let deleteWords="";
    if (indexDelete)
     {
         deleteArrayIndex(array,indexDelete);   //если есть del?i, то запускаем эту функцию
    }else if(valueDelete)  {
        deleteArrayWord(array,valueDelete)      //если есть del?value, то запускаем эту функцию
    }
    deleteWords=arrayToStringAndToUl(array);           //преобразуем массив
    res.send(deleteWords)
});   //первый параметр является адресом после http://localhost:3000/; req-запрос от клиента; res-ответ сервера клиенту




app.get('/', function (req, res) {

    const files = fs.readdirSync(directory);    //Прочитываем файлы из текущей директории, массив файлов в папке

    res.render('home', { title: 'Directory', value: files, list: array});   //генерация страниц 1-ый параметр шаблон
});

app.listen(3000, function () {
    console.log('Отслеживаем порт: 3000!');
});


//просто комментари


