//кнопка входа в главном меню
$("#enterButtonMain").click(function(event) {
    event.preventDefault();
    $.ajax({
        url: "/",   //путь
        type: "GET",   //Метод отправки
        success: function() {
            window.location.assign("http://localhost:3000/enter")    //если запросо прошел успешно, то перезапускаем страницу через аякс
        }
    });
});


//для формы для входа
$("#enterButton").click(function(event) {
    event.preventDefault();
    const emailUser = $("#inputEmail").val();
    // $("#inputEmail").val("");
    const passwordUser = $("#inputPassword").val();
    // $("#inputPassword").val("");
    $.ajax({
        url: "/ajax/enter",   //путь
        type: "GET",   //Метод отправки
        data:{
            email: emailUser,       //ключ:значение,потом все складывается с url
            password: passwordUser  //ключ:значение,потом все складывается с url
        },

            success: function(data) {
                // console.log('data', data)
                    // success: function(data){
                    // if (data==="200") {
                    //window.location.assign("http://localhost:3000")   //переход на главную страницу
                    // }    else {alert("Вы ввели неправильный логин или пароль!")}
                    // console.log(emailUser,passwordUser)}
                if(data.success==1) {
                    $("#resultServer").html($("#resultServer").text() + "<br>" + data.name + "<br>" + data.user);
                    //html-заменяем текст, text-берет значение в тэге
                }else if (data.success==0){
                    alert(data.message)
                }
            }
    });
});




//добавление файла с содержанием
$("#addText").click(function(event) {
    event.preventDefault();
    const domain = $("#domain").val();
    $("#addFiles").val("");
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
            window.location.reload()    //если запросо прошел успешно, то перезапускаем страницу через аякс
        }
    });
});


//удалить файл
$(".deleteItem").click(function(event) {
    event.preventDefault();
    const index = $(this).data('index');
    $.ajax({
        url: "/del",   //путь
        type: "GET",   //Метод отправки
        data:{
            delFile: index  //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()   //если запросо прошел успешно, то перезапускаем страницу через аякс
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