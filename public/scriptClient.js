
$("#pushButton").click(function(event) {
    event.preventDefault();
    const val = $("#addFiles").val();
    //const val = $("#addText").attr('value');   тоже самое, что и писал выше
    $("#addFiles").val("");
    $.ajax({
        url: "/add",   //путь
        type: "GET",   //Метод отправки
        data:{
            newFile: val  //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()    //если запросо прошел успешно, то перезапускаем страницу через аякс
        }
    });

});


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