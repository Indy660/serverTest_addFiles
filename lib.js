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


// ревлизовать функцию путь к папке результат колбек или промисс сумма чисел всех файлов (нельзя использовать синхзроные функция
///////////////////////////////////////////////////////////////////////////////
// function arrayFilesFunc(way) {
//     return fs.readdirSync(way);
// }

// console.log(arrayFilesFunc("C:\\Users\\User\\Desktop\\Summa cifr"))



// foldersAbove("C:\\Users\\User\\Desktop\\Summa cifr")


function arrayFilesFunc(way) {
    let final=[];
    let result = fs.readdirSync(way);
    for (let i=0; i<result.length; i++) {
        final.push(path.join(way, result[i]))
    }
    return final
}


function whatInThisFolder(way) {
    let unSorted = arrayFilesFunc(way);
    let arrayFolders = [];
    let arrayFiles = [];
    for (let i = 0; i<unSorted.length; i++) {
        if (thisIsFile(unSorted[i]) === false) {
            arrayFolders.push(unSorted[i])
        } else {
            arrayFiles.push(unSorted[i])
        }
    }
    return {arrayFolders, arrayFiles}
}

// console.log(whatInThisFolder("C:\\Users\\User\\Desktop\\Summa cifr\\2-47"))

function flattenDeep(arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}


function countAllFolders (readyFolders, notEmptyFolders) {
    if (notEmptyFolders.length !== 0) {
        for (let i = 0; i < notEmptyFolders.length; i++) {
            let nextFolder = notEmptyFolders[i];   //Прочитываем файлы из следующей директории
            // console.log("Путь " + nextFolder);
            let newFolders = whatInThisFolder(nextFolder).arrayFolders;  //массив следующих папок
            let lengthNewFolders = newFolders.length;
            // console.log("Кол-во папок в этой папке " + lengthNewFolders);
            if (lengthNewFolders === 0) {
                notEmptyFolders.shift();
                // console.log(hardFolder)
                countAllFolders (readyFolders, notEmptyFolders)
            } else {
                notEmptyFolders.shift();
                notEmptyFolders = flattenDeep([...newFolders, readyFolders]);
                 // console.log("hardFolder "+notEmptyFolders)
                readyFolders= flattenDeep([readyFolders, ...newFolders]);
                // console.log("simpleFolder "+readyFolders)
                countAllFolders (readyFolders, notEmptyFolders)
            }
        }
    }
    return readyFolders
}

console.log("Ответ "+countAllFolders ([], ["C:\\Users\\User\\Desktop\\Summa cifr"]));

// console.log(doubleArray([], ["C:\\Users\\User\\Desktop\\Summa cifr\\1-201\\130", "C:\\Users\\User\\Desktop\\Summa cifr\\1-201\\69", "C:\\Users\\\n" +
// "User\\Desktop\\Summa cifr\\2-67\\50", "C:\\Users\\User\\Desktop\\Summa cifr\\3 пусто\\все ещё пусто"]) )



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
// function countAllNumbersInAllFolders (way) {
//     let beginNumbers=countNumbersInThisFolder(way);
//     function countNumbersInAllFoldersAbove(way) {
//         let summ = 0;   //сумма файлов в этой папке
//         let folders = whatInThisFolder(way).arrayFolders;
//         //console.log(folders);
//         if (folders.length !== 0) {     //суммирование все файлов в папке выше
//             for (let j = 0; j < folders.length; j++) {
//                 let newWay = way + "\\" + folders[j];
//                 summ += countNumbersInThisFolder(newWay);
//                 console.log(j + ". " + folders[j] + " сумма " + summ)
//             }
//         }
//         if (folders.length !== 0) {         //если папка не пуста, то повторить операцию
//             for (let j = 0; j < folders.length; j++) {
//                 let newWay = way + "\\" + folders[j];
//                 let newFolders = whatInThisFolder(newWay).arrayFolders;
//                 if (newFolders.length !== 0) {
//                     return summ + countNumbersInAllFoldersAbove(newWay)
//                 }
//             }
//         }
//         return summ;
//     }
//     return beginNumbers+countNumbersInAllFoldersAbove(way)
// }
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




