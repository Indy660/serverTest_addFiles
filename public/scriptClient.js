
$("#pushButton").click(function(event) {
    event.preventDefault();
    const val = $("#addText").val();
    //const val = $("#addText").attr('value');   тоже самое, что и писал выше
    $("#addText").val("");
    $.ajax({
        url: "/add",   //путь
        type: "GET",   //Метод отправки
        data:{
            value: val  //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()    //если успешно, то перезапускаем страницу через аякс
        }
    });

});         //с помощью jquery и первых 2-х строчек заименили верхний код


$(".deleteItem").click(function(event) {
    event.preventDefault();
    const index = $(this).data('index');
    // console.log("индекс:", index)
    $.ajax({
        url: "/del",   //путь
        type: "GET",   //Метод отправки
        data:{
            i: index+1  //ключ:значение,потом все складывается с url
        },
        success: function(){
            window.location.reload()    //если успешно, то перезапускаем страницу через аякс
        }
    });
});