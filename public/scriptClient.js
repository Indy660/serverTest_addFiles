//кнопка входа в главном меню
$("#enterButtonMain").click(function(event) {
    event.preventDefault();
    $.ajax({
        url: "/",   //путь
        type: "GET",   //Метод отправки
        success: function() {
            window.location.assign("http://localhost:3000/enter")    //если запрос прошел успешно, то перезапускаем страницу через аякс
        }
    });
});


//для формы для входа
$("#enterButton").click(function(event) {
    event.preventDefault();
    const loginUser = $("#inputLogin").val();
    // $("#inputEmail").val("");
    const passwordUser = $("#inputPassword").val();
    // $("#inputPassword").val("");
    $.ajax({
        url: "/ajax/enter",   //путь
        type: "GET",   //Метод отправки
        data:{
            login: loginUser,       //ключ:значение,потом все складывается с url
            password: passwordUser  //ключ:значение,потом все складывается с url
        },
            success: function(data) {
                    // success: function(data){
                    // if (data==="200") {
                    //window.location.assign("http://localhost:3000")   //переход на главную страницу
                    // }    else {alert("Вы ввели неправильный логин или пароль!")}
                    // console.log(emailUser,passwordUser)}
                if(data.success==1) {
                    $("#resultServer").html($("#resultServer").text() + "<br> Вы вошли как" + data.name + "<br>" + data.user);
                    //html-заменяем текст, text-берет значение в тэге
                    setTimeout(function(){
                        window.location.assign("http://localhost:3000")
                    }, 2000)
                }else if (data.success==0){
                    alert(data.message)
                }
            }
    });
});




//добавление файла в папку
$("#addFile").click(function(event) {
    event.preventDefault();
    const domain = $("#domain").val();
    $("#domain").val("");
    const ip = $("#IP").val();
    $("#IP").val("");
    $.ajax({
        url: "/addDomain",   //путь
        type: "GET",   //Метод отправки
        data:{
            domain: domain,  //ключ:значение,потом все складывается с url
            ip: ip           //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()    //если запрос прошел успешно, то перезапускаем страницу через аякс
        }
    });
});


//удалить файл
$(".deleteFile").click(function(event) {
    event.preventDefault();
    const index = $(this).data('index');
    $.ajax({
        url: "/del",   //путь
        type: "GET",   //Метод отправки
        data:{
            delFile: index  //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()   //если запрос прошел успешно, то перезапускаем страницу через аякс
        }
    });
});



//кнопка для перехода в админку
$("#seeUsersButton").click(function(event) {
    event.preventDefault();
    $.ajax({
        url: "/",   //путь
        type: "GET",   //Метод отправки
        success: function() {
            window.location.assign("http://localhost:3000/users");    //если запрос прошел успешно, то перезапускаем страницу через аякс
        }
    });
});

//добавление пользователей в список
$("#addNewUser").click(function(event) {
    event.preventDefault();
    const nameNewUser = $("#nameNewUser").val();
    $("#nameNewUser").val("");
    const loginNewUser = $("#loginNewUser").val();
    $("#loginNewUser").val("");
    const passwordNewUser = $("#passwordNewUser").val();
    $("#passwordNewUser").val("");
    $.ajax({
        url: "/ajax/users",   //путь
        type: "GET",   //Метод отправки
        data:{
            user: nameNewUser,
            login: loginNewUser,
            password: passwordNewUser
        },
        success: function(data) {
            window.location.reload();
            if (data.success){
                alert(data.message);
            }
        }
    });
});




//сортировка списка
$(".sortButton").click(function(event) {
    event.preventDefault();
    const index = $(this).data('index');
    $.ajax({
        url: "/sort",   //путь
        type: "GET",   //Метод отправки
        data:{
            sort: index  //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()   //если запрос прошел успешно, то перезапускаем страницу через аякс
        }
    });
});



//удаления пользователя из списка
$(".buttonToDeleteUser").click(function(event) {
    event.preventDefault();
    const loginUserInput = $("#nameToDeleteUser").val(); //удаление по инпуту
    $("#nameToDeleteUser").val("");
    const stringToDelete = $(this).data('index');       //удаление по иконке
    $.ajax({
        url: "/delete",   //путь
        type: "GET",   //Метод отправки
        data:{
            deleteThisLogin: loginUserInput,
            deleteThisString: stringToDelete
        },
        success: function(data) {
            window.location.reload();
            if (data.success){
                alert(data.message);
            }
        }
    });
});

//старая функция добавления файлов
// $("#pushButton").click(function(event) {
//     event.preventDefault();
//     const val = $("#addFiles").val();
//     //const val = $("#addText").attr('value');   тоже самое, что и писал выше
//     $("#addFiles").val("");
//     $.ajax({
//         url: "/add",   //путь
//         type: "GET",   //Метод отправки
//         data:{
//             nameFile: val  //ключ:значение,потом все складывается с url
//         },
//         success: function(){
//             window.location.reload()    //если запросо прошел успешно, то перезапускаем страницу через аякс
//         }
//     });
// });