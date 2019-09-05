//Подключение модулей
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
    app.set('views', __dirname + '/views');   //указывает путь к шаблонам
    app.set('view engine', 'ejs');            //шаблонизатор, какое расширение
    app.use(express.static('public'));  //статичные объекты, в том числе и скрипт для клиента
const url = require('url');
const cors=require('cors');
    app.use(cors());
const bodyParser = require('body-parser');   //для пост запросов
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

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
    const folder = directory + "\\" + req.query.delFile;
    fs.unlink(folder, err => {   //CALLBACK ФУНКЦИЯ, первый способ
        console.error(err);
        res.send("200");    //выведем 200ок
    })
});



//вспомогательная функция для перезаписи файлов
function changeText(way, str1, str2) {
let oldText=fs.readFileSync(way, "utf8");
let domenWithoutDots=str1.replace(/\./g, "");
let newText=oldText.replace(/__DOMAIN__/g, str1).replace(/__DOMAINWITHOUTDOT__/g, domenWithoutDots).replace(/__IP_ADDRESS__/g, str2);
    return newText
}

//перезапись файла template.conf на выбранный файл   //CALLBACK ФУНКЦИЯ
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
    res.render('enter');
});



let userList = [
    { id: 1, name: 'Admin', login: 'Admin', password:"qwe"},
    { id: 2, name: 'TestUser', login: 'test', password:"123"},
    { id: 3, name: 'Dima', login: 'DimaK', password:"12345"},
    { id: 4, name: 'Sacha', login: 'gundi5', password:"BF236BF"},
    { id: 5, name: 'Дима', login: 'Indy660', password: '123' }
];
let beginLengthArray=userList.length

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


//страница вывода таблицы пользователей
// app.get('/users', function (req, res) {
//     res.render('list_users', {users: userList} );
// });


//страница с добавлением пользователя (после vue не нужна)
// app.get('/ajax/users', function (req, res) {
//     let user = req.query.user;
//     let login = req.query.login;
//     let password = req.query.password;
//     const newUserArray={id:++beginLengthArray, name:user,  login: login, password:password};
//     let result=threreIsSuchUser(userList, login);
//     if (result===false) {
//         userList.push(newUserArray);
//         console.log(userList);
//         res.json({success:1, message:"Новый пользователь добавлен!"})
//         }
//     else {
//         res.json({success:2, message:"Такой логин занят!"})
//     }
// });


// //вспомогательная функция для сортировки, но громоздкая
// function sortSomething(thing, array) {
//     if (typeof(array[Object.keys(array)[0]][thing])==='number') {
//         array.sort(function (a, b) {
//             if (a[thing] < b[thing]) {
//                 return b[thing] - a[thing]
//             } else {
//                 return a[thing] - b[thing]
//             }
//         })
//     }
//     else if (array[Object.keys(array)[0]][thing] > array[Object.keys(array)[1]][thing]) {
//         array.sort(function (a, b) {
//             if (a[thing] < b[thing]) {
//                 return -1
//             } else {return 1}
//         })
//     }
//     else if (array[Object.keys(array)[0]][thing] < array[Object.keys(array)[1]][thing]) {
//         array.sort(function (a, b) {
//             if (a[thing] < b[thing]) {
//                 return 1
//             } else {return -1}
//         })
//     }
// }

// //  сортировка пользователей, работала с клиентской частью
// app.get('/sort', function(req, res) {
//     const whatSort = req.query.sort;
//     sortSomething(whatSort, userList);
//     res.send("200");
// });
//
//

//вспомогательная функция для сортировки, усовершенствованная (после vue не нужна)
// function sortSomething(thing, array, k) {
//     array.sort(function (a, b) {
//         if (a[thing] < b[thing]) {
//             return -1*k
//         } else {return k}
//     })
// }

//  //  сортировка пользователей, работает только с html и href запросами (после vue не нужна)
// app.get('/users', function(req, res) {
//     const whatSort = req.query.sort;
//     let directionSort= Number(req.query.k || 1);
//     if (Boolean(whatSort)) {
//         sortSomething(whatSort, userList, directionSort)
//     }
//         res.render('list_users', {users: userList, nextDirection: -1*directionSort} );
// });




// //удаление пользователей из списка (после vue не нужна)
// app.get('/delete', function(req, res){
//     let login = req.query.deleteThisLogin || req.query.deleteThisString;
//     let userData=threreIsSuchUser(userList, login);
//     // console.log(login);
//     // console.log(userData);
//     if (Boolean(userData)) {
//         let userIndexReal=userList.indexOf(userData);
//         // console.log(userIndexNow);
//         userList.splice(userIndexReal, 1);
//         let alertGood="Пользователь удален!";
//         res.json ({success:1, message:alertGood })
//     }
//     else {
//         let alertBad="Такого пользователя не существует, проверьте правильность написания логина.";
//         res.json ({success:2, message:alertBad })
//     }
// });

//страница json массива
app.get('/ajax/users.json', function (req, res) {
    res.json(userList);
});

function threreIsSuchId(list, trueId) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === trueId) {
            return list[i]
        }
    }
    return false
}


//удаление пользователей из списка json
app.get('/ajax/users.json/delete', function(req, res) {
    let index = Number(req.query.id);
    let userData=threreIsSuchId(userList, index);
    let userIndexReal=userList.indexOf(userData);
    userList.splice(userIndexReal, 1);
    res.json({
        user_id: userData.id
    });
    // let userData=threreIsSuchId(userList, index);
    // if (Boolean(userData)) {
    //     let userIndexReal=userList.indexOf(userData);
    //     userList.splice(userIndexReal, 1);
    //     res.json(userList);
    // }
    // else {
    //     console.log("Нет такого пользователя!");
    //     res.json(userList);
    // }
});


//добавление пользователей в список json
app.post('/ajax/users.json/addUser', function(req, res) {
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
        res.json({
            message:console.log("Такой пользователь уже есть")
        })
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


