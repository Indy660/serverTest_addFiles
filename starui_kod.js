
// ____________________VUE ____________________

// methods:{
// deleting: function (login) {     //только с клиентской частью
//   let user=this.findThisUser(this.userList, login);
//   let trueIndex= this.userList.indexOf(user);
//   this.userList.splice(trueIndex, 1)
// },

// findThisUser: function(list, trueLogin) {
//   for (let i = 0; i < list.length; i++) {
//     if (list[i].login === trueLogin) {
//       return list[i]
//     }
//   }
//   return false
// }
// userSortList: function () {   //длинная функция сортировки
//   console.log('this.userList',this.userList);
//       const sortColumn = this.sortColumn;
//       if (this.sortDirection===-1) {
//         return this.userList.slice().sort((a, b)=> {
//           if (a[sortColumn] < b[sortColumn]) {
//             return -1
//           } else {
//             return 1
//           }
//         });
//       }
//       else {
//         return this.userList.slice().sort((a, b) => {
//           if (a[sortColumn] < b[sortColumn]) {
//             return 1
//           } else {
//             return -1
//           }
//         });
//       }
//     }
//   },

// метод заменен на filter
// computed: {
//     searchMethod() {
//         let obj = this.userFiles;
//         let newArray = [];
//         const serach = this.search.toLowerCase();
//         for (let key in obj) {
//             let el = obj[key]
//             if (el.domain.toLowerCase().indexOf(serach) != -1) newArray.push(el);
//             else if (el.ip.toLowerCase().indexOf(serach) != -1) newArray.push(el)
//         }
//         return newArray;
//     }
// }


// ____________________JS  ____________________
const fs = require('fs');
app.set('views', __dirname + '/views');   //указывает путь к шаблонам
app.set('view engine', 'ejs');            //шаблонизатор, какое расширение
app.use(express.static('public'));  //статичные объекты, в том числе и скрипт для клиента
const url = require('url');
const path = require('path');
//добовляет файлы которые на компьютере для загрузки если они имеются
app.use(express.static(path.join(__dirname, 'public')));
const directory="C:\\Users\\User\\Desktop\\Работа\\serverTest_addFiles\\experimentFolder";


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

app.post('/ajax/users.json/checkuser', function(req, res, next) {
    let nameUser = req.body.login;
    let passwordUser = req.body.password;
    let checkingUser=threreIsSuchUser(userList, nameUser);
    return jwt.sign({ data, }, signature, { expiresIn: expiration });
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

//виды передачи данных
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

//Логика сервера на VUE


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


///////////////////////////////////////////////////////////////////////////////////////////////////////


function filesInDirectory(filesInDirectory) {
    let filesArr = [] //массив для хранения txt файлов
    let folderArr = [] //массив для хранения папок

    for (let i = 0; i < filesInDirectory.length; i++) {
        if (filesInDirectory[i].substr(-4, 4) === '.txt') filesArr.push(filesInDirectory[i])
        else folderArr.push(filesInDirectory[i])
    }
    return {
        filesArr,
        folderArr
    }
}

function dataInFolders(folderArr, directory) {
    let filesCurrentDirectory = []
    let finalFilesArr = []
    let result = []

    for (let i = 0; i < folderArr.length; i++) {
        filesCurrentDirectory[i] = fs.readdirSync(directory + folderArr[i]); //Прочитываем файлы из текущей директории
        let filesOrFolder = filesInDirectory(filesCurrentDirectory[i])

        if (filesOrFolder.filesArr) {
            finalFilesArr.push(filesOrFolder.filesArr)  //массив файлов
        }
        if (filesOrFolder.folderArr) {
            dataInFolders(filesOrFolder.folderArr, directory + folderArr[i] + '/')  //массив папок
        }
    }

    if (finalFilesArr != '') {
        let a = finalFilesArr.join().split(',')
        console.log(a)

        for (let i = 0; i < a.length; i++) {
            console.log(a[i])
            result=[...a[i]];
        }
        //  console.log(result)
    }
}
























//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//НЕУДАЧНЫЕ ФУНКЦИИ ПО ЧТЕНИЮ ПАПОК

function dataInFolders(folderArr) {
    let filesNextDirectory
    // let result = []
    for (let i = 0; i < folderArr.length; i++) {
        filesNextDirectory = arrayFilesFunc(folderArr[i]);   //Прочитываем файлы из текущей директории
        console.log("Файлы в текущей директрории " + filesNextDirectory)
        if (Boolean(thisIsFile(filesNextDirectory[i])) === false) {
            console.log("Папки выше " + filesNextDirectory[i])
            folderArr.push(filesNextDirectory[i])
            dataInFolders(folderArr)
        }
        // else  {
        //
        // }
    }
    return folderArr
}

// console.log("Answer "+dataInFolders(["C:\\Users\\User\\Desktop\\Summa cifr\\1-201\\130", "C:\\Users\\User\\Desktop\\Summa cifr\\1-201\\69", "C:\\Users\\\n" +
// "User\\Desktop\\Summa cifr\\2-67\\50", "C:\\Users\\User\\Desktop\\Summa cifr\\3 пусто\\все ещё пусто"]))

///////////////////



function thisIsFile(way) {
    return fs.statSync(way).isFile()
}


function foldersAbove(way) {
    let array=[];
    let folders = whatInThisFolder(way).arrayFolders;
    // console.log("папки "+folders);
    if (folders.length !== 0) {         //если папка не пуста, то повторить операцию
        for (let j = 0; j < folders.length; j++) {
            let newWay = folders[j];
            let newFolders = whatInThisFolder(newWay).arrayFolders;
            if (newFolders.length !== 0) {
                array.push(newFolders)
            }
        }
    }
    return array;
}


function countNumbersInFile(way, file) {
    return Number(fs.readFileSync(path.join(way, file), "utf8"));
}



module.exports = function getFiles(directory){

    return []
}


// function whatInThisFolder(way) {
//     let unSorted = arrayFilesFunc(way);
//     let arrayFolders = unSorted.filter(function(elem) {
//         if (elem.substr(-4, 4) !== ".txt") {
//             return true;
//         } else {
//             return false;
//         }
//     });
//     let arrayFiles = unSorted.filter(function(elem) {
//         if (elem.substr(-4, 4) === ".txt") {
//             return true;
//         } else {
//             return false;
//         }
//     });
//     return {arrayFolders, arrayFiles}
// }



//сделать список файлов во всех папках (адрес)






//
// console.log(fs.statSync("C:\\Users\\User\\Desktop\\Summa cifr\\2-47\\7.txt").isFile())






//
// function countNumbersInThisFolder(way) {
//     let summ = 0;
//     let files = whatInThisFolder(way).arrayFiles;
//     //console.log(files)
//     for (let i=0; i<files.length; i++) {
//         summ+=countNumbersInFile(way, files[i])
//     }
//     return summ
// }
//
// function whatBeInNextFolder(way, arrayFolders) {
//     // let summ = 0;
//     let folders;
//     for (let i = 0; i<arrayFolders.length; i++) {
//         // summ += countNumbersInThisFolder(way +"\\"+ arrayFolders[i]);
//         folders = whatInThisFolder(way +"\\"+ arrayFolders[i]).arrayFiles;
//     }
//     if (folders !== 0) {
//         let newFolders=folders.shift();
//         return newFolders + whatBeInNextFolder(way +"\\"+  folders[0], folders)
//     }
//     return folders
// }
//
//
//
function countAllNumbersInAllFolders (way) {
    let beginNumbers=countNumbersInThisFolder(way);
    function countNumbersInAllFoldersAbove(way) {
        let summ = 0;   //сумма файлов в этой папке
        let folders = whatInThisFolder(way).arrayFolders;
        //console.log(folders);
        if (folders.length !== 0) {     //суммирование все файлов в папке выше
            for (let j = 0; j < folders.length; j++) {
                let newWay = way + "\\" + folders[j];
                summ += countNumbersInThisFolder(newWay);
                console.log(j + ". " + folders[j] + " сумма " + summ)
            }
        }
        if (folders.length !== 0) {         //если папка не пуста, то повторить операцию
            for (let j = 0; j < folders.length; j++) {
                let newWay = way + "\\" + folders[j];
                let newFolders = whatInThisFolder(newWay).arrayFolders;
                if (newFolders.length !== 0) {
                    return summ + countNumbersInAllFoldersAbove(newWay)
                }
            }
        }
        return summ;
    }
    return beginNumbers+countNumbersInAllFoldersAbove(way)
}
// // console.log(countAllNumbersInAllFolders("C:\\Users\\User\\Desktop\\Summa cifr"));
//
//
// // countNumbersInThisFolder("C:\\Users\\User\\Desktop\\Summa cifr");
//
// function deleteFromArray(obj, whatDelete) {
//     obj[whatDelete].shift();
//     return obj
// }
//
// // if (folders.length !== 0) {     //суммирование все файлов в папке выше
// //     for (let j = 0; j < folders.length; j++) {
// //         let newWay = way + "\\" + folders[j];
// //         summ += countNumbersInThisFolder(newWay);
// //         console.log(j + ". " + folders[j] + " сумма " + summ)
// //         let newFolders = whatInThisFolder(newWay).arrayFolders;
// //         if (newFolders.length !== 0) {
// //             return summ + countNumbersInAllFoldersAbove(newWay)
// //         }
// //     }
// // }
//
//
//
//
//
// function goDown(way) {
//
// }
// // console.log(whatInThisFolder("C:\\Users\\User\\Desktop\\Summa cifr"))
// // let a = {
// //     arrayFolders: ['1', '2', '3 пусто'],
// //     arrayFiles: ['52.txt']
// // }
//
//
//
//
//
//
//
//
//
//
// // function countNumbers(way) {
// //     let summ = 0;
// //     let arrayFiles=arrayFilesFunc(way);
// //     console.log("arrayFiles = "+arrayFiles)
// //     for (let i=0; i<arrayFiles.length; i++) {
// //         summ+=Number(countNumbersInFile(way+"\\"+arrayFiles[i]));
// //     }
// //     return summ;
// // }
// //
// //
// //
// //
// //
// // console.log('answer = '+countNumbers(newDirectory));
//
//
//
//
// // function countAllNumbers() {
// //     let newDirectory="C:\\Users\\User\\Desktop\\Summa cifr";
// //     // const folder = newDirectory;
// //    // return fs.readFile(newDirectory, "utf8",
// //    //      function(error,data) {
// //    //          if(error) throw error; // если возникла ошибка
// //    //          console.log(data);  // выводим считанные данные
// //    //      });
// //     let fileContent = fs.readdir(newDirectory,  function(error,data) {
// //                  if(error) throw error; // если возникла ошибка
// //                  console.log(data);  // выводим считанные данные
// //              });
// //   return  console.log(fileContent);
// // }
//
//
//
// // function countNumbersInFile(way) {
// //     return fs.readFile(way, "utf8",
// //         function (error, data) {
// //             if (error) throw error;
// //             console.log(data);
// //         });
// // }
//
//
//
// //  fs.readdir(newDirectory,  function(error,data) {
// //     if(error) throw error; // если возникла ошибка
// //     console.log(data);  // выводим считанные данные
// // });
//
//
// function countAllNumbers(way) {
//     return fs.readdir(way, function (error) {
//         if (error) throw error;
//     }).then(data => {(
//         fs.readFile(way+"\\"+data[0], "utf8",
//             function (error, data) {
//                 if (error) throw error;
//                 console.log(data);
//             })
//     )})
// }
//
// // function countAllNumbers(way) {
// //     return fs.readdir(way, function (error, data) {
// //             if (error) throw error;
// //             // for (let i=0, i<data.length, i++) {
// //         fs.readFile(way+"\\"+data[0], "utf8",
// //             function (error, data) {
// //                 if (error) throw error;
// //                 console.log(data);
// //             })
// //         })
// // }
//
// var async = require("async");
//
// var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
// var configs = {};
//
// // function countAllNumbers(way) {
// //     return fs.readdir(way, function (error, data) {
// //         if (error) throw error;
// //         // for (let i=0, i<data.length, i++) {
// //         fs.readFile(way+"\\"+data[0], "utf8",
// //             function (error, data) {
// //                 if (error) throw error;
// //                 console.log(data);
// //             })
// //     })
// // }
// //
// // countAllNumbers("C:\\Users\\User\\Desktop\\Summa cifr\\1\\1_1")
// //
// // async.map(['C:\\Users\\User\\Desktop\\Summa cifr\\1\\1_1','C:\\Users\\User\\Desktop\\Summa cifr\\1\\1_2'], fs.stat, function(err, results){
// //    console.log(results)
// // });
// //
// // async.map(['C:\\Users\\User\\Desktop\\Summa cifr\\1\\1_1','C:\\Users\\User\\Desktop\\Summa cifr\\1\\1_2'],  fs.readFile, function(err, results){
// //     console.log(results)
// // });
//
//
// // const fsPromises = fs.promises;
// // async function listDir() {
// //     try {
// //         return await fsPromises.readdir('experimentFolder');
// //     } catch (err) {
// //         console.error('Error occured while reading directory!', err);
// //     }
// // }
// // listDir();
//
// // async function file (way) {
// //         let arrayFiles = await fs.readdir(way, function (error, data) {
// //             if (error) throw error
// //             console.log(data)
// //         });
// //         await console.log(arrayFiles)
// //         // let numbers = await fs.readFile(way + "\\" + arrayFiles[0], "utf8",
// //         //     function (error, data) {
// //         //         if (error) throw error;
// //         //         console.log(data);
// //         //     })
// // }
// // file ("C:\\Users\\User\\Desktop\\Summa cifr\\1\\1_1");
//
//
//
//
// // function countAllNumbersInAllFolders (way) {
// //     let beginNumbers=countNumbersInThisFolder(way);
// //     function countNumbersInAllFoldersAbove(way) {
// //         let summ = 0;   //сумма файлов в этой папке
// //         let folders = whatInThisFolder(way).arrayFolders;   //существующая папка
// //         console.log("folders "+folders);
// //         if (folders.length !== 0) {     //суммирование все файлов в папке выше
// //             for (let j = 0; j < folders.length; j++) {
// //                 let newWay = path.join(way, folders[j]);
// //                 summ += countNumbersInThisFolder(newWay);
// //                 console.log(j + ". " + folders[j] + " сумма " + summ)
// //             }
// //         }
// //         //если папка не пуста, то повторить операцию
// //         let preFolders=[];
// //         for (let j = 0; j < folders.length; j++) {
// //             let newWay = path.join(way, folders[j]);
// //             let newFolders = whatInThisFolder(newWay).arrayFolders;
// //             console.log("папка "+j + ". " + newFolders[j] );
// //             if (newFolders.length !== 0) {
// //                 // summ + countNumbersInAllFoldersAbove(newWay)
// //                 preFolders.push(newFolders);
// //             }
// //         }
// //         if (preFolders > 0) {
// //             let a
// //             for (let i=0; i<preFolders.length; i++) {
// //                 a += summ + countNumbersInAllFoldersAbove(path.join(way, preFolders[i]))
// //             }
// //         }
// //         return a;
// //     }
// //     return beginNumbers+countNumbersInAllFoldersAbove(way)
// // }
// // console.log(countAllNumbersInAllFolders("C:\\Users\\User\\Desktop\\Summa cifr"));
//
//
//
//
// // way
//
//
//
//
//
//
// // function dataInFolders(folderArr, directory) {
// //     let filesCurrentDirectory = []
// //     let finalFilesArr = []
// //     let result = []
// //
// //     for (let i = 0; i < folderArr.length; i++) {
// //         filesCurrentDirectory[i] = fs.readdirSync(directory + folderArr[i]); //Прочитываем файлы из текущей директории
// //         let filesOrFolder = filesInDirectory(filesCurrentDirectory[i])
// //
// //         if (filesOrFolder.filesArr) {
// //             finalFilesArr.push(filesOrFolder.filesArr)  //массив файлов
// //         }
// //         if (filesOrFolder.folderArr) {
// //             dataInFolders(filesOrFolder.folderArr, directory + folderArr[i] + '/')  //массив папок
// //         }
// //     }
// //
// //     if (finalFilesArr != '') {
// //         let a = finalFilesArr.join().split(',')
// //         console.log(a)
// //
// //         for (let i = 0; i < a.length; i++) {
// //             console.log(a[i])
// //             result=[...a[i]];
// //         }
// //         //  console.log(result)
// //     }
// // }

// function countAllFolders (readyFolders, notEmptyFolders) {
//     if (notEmptyFolders.length > 0) {
//         for (let i = 0; i < notEmptyFolders.length; i++) {
//             let nextFolder = notEmptyFolders[i];   //Прочитываем файлы из следующей директории
//             // console.log("Путь " + nextFolder);
//             let newFolders = whatInThisFolder(nextFolder).arrayFolders;  //массив следующих папок
//             let lengthNewFolders = newFolders.length;
//             // console.log("Кол-во папок в этой папке " + lengthNewFolders);
//             if (lengthNewFolders === 0) {
//                 notEmptyFolders.shift();
//                 // console.log(hardFolder)
//                 countAllFolders (readyFolders, notEmptyFolders)
//             } else {
//                 notEmptyFolders.shift();
//                 notEmptyFolders = flattenDeep([...newFolders, readyFolders]);
//                   console.log("hardFolder "+notEmptyFolders)
//                 readyFolders= flattenDeep([readyFolders, ...newFolders]);
//                 // console.log("simpleFolder "+readyFolders)
//                 countAllFolders (readyFolders, notEmptyFolders)
//             }
//         }
//     }
//     return readyFolders
// }


// console.log("Кол-во папок в этой папке " + lengthNewFolders);
//     readyFolders.push(newFolders);              //добавляем папки в конец
//     readyFolders = flattenDeep([readyFolders]);
//     notEmptyFolders.shift();                    //удаление первого элемента
//     // console.log(i + " notEmptyFolders " + notEmptyFolders);
//     notEmptyFolders.unshift(newFolders);        //добавляем новые папки в начало
//     notEmptyFolders = flattenDeep([notEmptyFolders]);
//     // console.log(i + " simpleFolder " + readyFolders)
//     countAllFolders(readyFolders, notEmptyFolders)
