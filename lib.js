//Подключение модулей

const fs = require('fs');
const path = require('path');

function flattenDeep(arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}     // ненужная функция


function arrayFilesFunc(way) {
    let final=[];
    let result = fs.readdirSync(way);
    for (let i = 0; i < result.length; i++) {
        final.push(path.join(way, result[i]))
    }
    return final
}

function thisIsFile(way) {
    return fs.statSync(way).isFile()
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



function countAllFolders (way) {
    function twoArray(readyFolders, notEmptyFolders) {
        if (notEmptyFolders.length > 0) {
            let nextFolder = notEmptyFolders[0];   //Прочитываем файлы из следующей директории
            // console.log("Путь " + nextFolder);
            let newFolders = whatInThisFolder(nextFolder).arrayFolders;  //массив следующих папок
            for (let i = 0; i < newFolders.length; i++) {
                readyFolders.push(newFolders[i]);
                notEmptyFolders.shift();                         //удаление первого элемента
                notEmptyFolders.unshift(newFolders[i]);
                twoArray(readyFolders, notEmptyFolders)
            }
        }
        return readyFolders
    }
    return twoArray([way], [way])
}
 // console.log(countAllFolders("C:\\Users\\User\\Desktop\\Summa cifr"));


function showFiles (way) {
    let folders = countAllFolders (way);
    let files = [];
    for (let i = 0; i < folders.length; i++) {              //пути
        let preFiles = whatInThisFolder(folders[i]).arrayFiles;
        for (let j = 0; j < preFiles.length; j++) {       //файлы
                files.push(preFiles[j])
            }
        }
    return files
}

function countNumbersInFiles(way) {
    let files = showFiles (way);
    let summ = 0;
    for (let i = 0; i < files.length; i++) {
        summ += Number(fs.readFileSync( files[i], "utf8"));
    }
    return summ
}

// console.log(showFiles("C:\\Users\\User\\Desktop\\Summa cifr\\2-67"))



module.exports = countNumbersInFiles;



