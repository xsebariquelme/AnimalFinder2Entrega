// Initialize your app
var myApp = new Framework7();

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

document.addEventListener("deviceready", function(){
    $("#iniciar").bind("click",login);
     $("#camera").bind("click",camara);
    $("#btnlogin").bind("click",iniciar_session);
    $("#registro").bind("click",registro);
    $("#btnregistro").bind("click",registro);
    $("#btnback").bind("click", gotoindex);
    $("#cerrarindex").bind("click", gotoindex);
    $("#registrarcuenta").bind("click",registrarcuenta);
    $("#back").bind("click",back);
	$("#pet3").bind('click', gomain);
    $("[id*=pet]").bind('click', showpet);
	$('#listar').bind('click', listaPerdidas);
	$('#cerrarmain').bind('click', gomain);
	//$('#pet2').bind('click', notificacion);
    $('#nombre_user_session').html('<b>Hola ' + localStorage.getItem('nombre_completo') + '</b>');
    $('#tosend').bind('click', uploadPhoto);
    $('#cerrarsesion').bind('click', cerrarsesion);
      $('#geo').bind('click', geo);

});
function geo(){
    myApp.showPreloader('Localizando...');
    navigator.geolocation.getCurrentPosition(
        function(position){
            $('#lat').html(position.coords.latitude);
            $('#lon').html(position.coords.longitude);
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 16
            });
            var marker = new google.maps.Marker({
                position: {lat: position.coords.latitude, lng: position.coords.longitude},
                map: map,
                title: 'Mi posición'
            });
            
            myApp.hidePreloader();
            myApp.popup('.popup-geo');
        },
        function(error){
            myApp.alert('Se ha producido un error','Animal Finder');
            myApp.hidePreloader();
        },
        {
            maximumAge: 3000, 
            timeout: 5000,
            enableHighAccuracy: true 
        }
    );
}

function showpet(idpet){
     // myApp.showPreloader('Cargando...');
    console.log("Cargando");
    $.ajax({
          dataType: 'json',
          type: 'POST',
          data: {
              id:idpet
              
          },
       
          url: 'http://servicioswebmoviles.hol.es/index.php/WS_SOLICITARINFOPERDIDAS',
          success: function (data, status, xhr) {
               console.log("Cargando5");
              if(data.respuesta==null){
                  var html_text='';
             html_text += "<div class='content-block-title'> Detalle Mascota Perdida </div>";
            html_text += "<!-- Inset content block -->";
            html_text += "<div class='content-block inset'>";
            html_text += "<div class='content-block-inner'>";
            html_text += "<p><h4>"+data.nombre+"</h4></p>";
            html_text += "<p>"+data.descripcion+"</p>";
            html_text += "<p>"+data.nombre_dueno+" Contacto: "+data.contacto+"</p>";
            html_text += "<p>Ayuda porfavor!!</p>";
            html_text += "<img src="+data.path+" width='100%'/>";
            html_text += "<a class='bottom'  id='pet1'>Enviar Notificación</a>";
            html_text += "<p><a href='#' class='close-popup'>Cerrar</a></p>";
            html_text += "</div>";
            html_text += "</div>";
         $('#contenedor2').append(html_text);
                    console.log("Cargando2");
                    myApp.hidePreloader();
                   myApp.popup('.popup-mascota-detalle');
                  }else{
                  myApp.hidePreloader();
                  var msg = data.respuesta;
                   myApp.popup('.popup-search');
              }
          },
          error: function (xhr, status) {
               console.log("Cargando3");
              myApp.hidePreloader();
              myApp.alert('Datos Incorrectos ','Animal Finder');
          }
      });
   console.log("Cargando4");
}
function cerrarsesion(){
        window.location = "index.html";

}

function registrarcuenta(){
    var direccion = $('#direccion').val();
    var nombres = $('#name').val();
    var apellidoP = $('#apellidoP').val();
    var apellidoM = $('#apellidoM').val();
    var email = $('#correo').val();
    var nick = $('#nick').val();
    var pass = $('#pass').val();
    myApp.showPreloader('Registrando...');
    if(!(direccion.length<=0||nombres.length<=0||apellidoP.length<=0||apellidoM.length<=0||email.length<=0||nick.length<=0||pass.length<=0)){
    $.ajax({
          dataType: 'json',
          type: 'POST',
          data: {
              nombreUser:nick, 
              pass:pass, 
              nombres:nombres,
              aPaterno:apellidoP,
              aMaterno:apellidoM,
              email:email,
              direccion:direccion
              
          },
          url: 'http://servicioswebmoviles.hol.es/index.php/WS_NUEVO_USUARIO',
          success: function (data, status, xhr) {
              if(data.guardado){
                  myApp.hidePreloader();
                  console.log("Registrado");
                  window.location = "login.html";
              }else{
                  myApp.hidePreloader();
                  var msg = "Datos no guardados";
                  myApp.alert(msg,'Animal Finder');
              }
          },
          error: function (xhr, status) {
              myApp.hidePreloader();
              myApp.alert('Datos Incorrectos','Animal Finder');
          }
      });
}else{
            myApp.hidePreloader();
              myApp.alert('Debe completar los campos','Animal Finder');
}
}
function gomain(){
      window.location = "main-init.html";
}

function listaEncontrada(){
    
    $.ajax({
          dataType: 'json',
          type: 'POST',
          data: {
          },
          url: 'http://servicioswebmoviles.hol.es/index.php/WS_LISTADOENCONTRADAS',
          success: function (data, status, xhr) {
              if(data.respuesta==null){
                    var html_text = '';
                    for (var i in data) {
                    html_text += " <li >";
                    html_text += "  <a id='pet' href='#' class='item-link item-content ' onclick='showpet("+data[i].id_mascota+")' >";

                   html_text += " <div class='item-media'><img src="+data[i].path_imagen+" width="+44+"></div>";
                   html_text += " <div class='item-inner'>";
                   html_text += " <div class='item-title-row'>";
                   html_text += " <div class='item-title'>"+data[i].nombre+"</div>";
                   html_text += " </div>";
                   html_text += " <div class='item-subtitle'>"+data[i].descripcion+" (Mascota con localización)</div>";
                   html_text += " </div>";

                    html_text += "<input type='hidden' id='idpet' value ="+data[i].id_mascota+">";
                    html_text += "<input type='hidden' id='lat' value ="+data[i].lat+">";
                    html_text += "<input type='hidden' id='lon' value ="+data[i].lon+">";
                   html_text += " </a>";
                   html_text += " </li >";
                        
                   
                  
                        
                    }
                  
                  $('#contenedor').append(html_text);
                   
                    myApp.hidePreloader();
                   myApp.popup('.popup-search');
              }else{
                  myApp.hidePreloader();
                  var msg = data.respuesta;
                   myApp.popup('.popup-search');
              }
          },
          error: function (xhr, status) {
              myApp.hidePreloader();
              myApp.alert('Error de conexión','Error');
          }
      });
  
   
}
function listaPerdidas(){
    
                     myApp.showPreloader('Cargando...');
    $.ajax({
          dataType: 'json',
          type: 'POST',
          data: {
          },
          url: 'http://servicioswebmoviles.hol.es/index.php/WS_LISTADOPERDIDA',
          success: function (data, status, xhr) {
              if(data.respuesta==null){
                    var html_text = '';
                    for (var i in data) {
                    html_text += " <li >";
                    html_text += "  <a id='pet"+data[i].id_mascota+"' href='#' class='item-link item-content 'onclick='showpet("+data[i].id_mascota+")' >";

                   html_text += " <div class='item-media'><img src="+data[i].path_imagen+" width="+44+"></div>";
                   html_text += " <div class='item-inner'>";
                   html_text += " <div class='item-title-row'>";
                   html_text += " <div class='item-title'>"+data[i].nombre+"</div>";
                   html_text += " </div>";
                   html_text += " <div class='item-subtitle'>"+data[i].descripcion+" (Mascota sin localización)</div>";
                   html_text += " </div>";

                    html_text += "<input type='hidden' id='idpet' value ="+data[i].id_mascota+">";
                   html_text += " </a>";
                   html_text += " </li >";
                        
                   
                  
                        
                    }
                  
                  $('#contenedor').append(html_text);
                 listaEncontrada();
              }else{
                  myApp.hidePreloader();
                  var msg = data.respuesta;
                  myApp.alert(msg,'Animal Finder');
              }
          },
          error: function (xhr, status) {
              myApp.hidePreloader();
              myApp.alert('Error Conexión','Animal Finder');
          }
      });
  
   
}
function notificacion(){
	myApp.alert('Se ha enviado una notificación al dueño','Animal Finder');
}

function gotoindex(){
      window.location = "index.html";  

}
function camara(){
    navigator.camera.getPicture(function(photo){
        $('#imgd').attr('src',photo);
            myApp.prompt('Ingrese nombre de la mascota', function (value) {
                //myApp.alert('Your name is "' + value + '". You clicked Ok button');
                localStorage.setItem('nombrePet',value);
            });
            myApp.prompt('Ingrese detalle de la mascota', function (value) {
                localStorage.setItem('detallePet',value);
            });
    }, function(error){
        myApp.alert('Error al tomar la fotografía','Animal Finder')
    }, {
        quality:100,
        correctOrientation: true
    });
}
function uploadPhoto() {
    if($('#imgd').attr('src') == 'img/no-foto.png'){
         $('#imgd').attr('src','');
    }
    if($('#imgd').attr('src') != ''){
		var id = localStorage.getItem('id');
        var imageURI = $('#imgd').attr('src');
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";
        
        var params = new Object();
        params.nombre = localStorage.getItem('nombrePet');
        console.log(params.nombre);
		params.id_usuario=id;
        console.log(params.id_usuario);
		params.descripcion=localStorage.getItem('detallePet');
        console.log(params.descripcion);
        options.params = params;
        options.chunkedMode = false;
        myApp.showPreloader('Registrando...');
        var ft = new FileTransfer();
        ft.upload(imageURI, "http://servicioswebmoviles.hol.es/index.php/WS_REGISTRARMASCOTA", win, fail, options);
    }else{
        myApp.alert('No hay foto','Animal Finder');
    }
}
function win(r) {
    myApp.hidePreloader();
    var json = JSON.parse(r.response);
    
    if(json.respuesta){
        localStorage.setItem('idperdida', json.IdPerdida);
		localStorage.setItem('idMascota', json.IdMascota);
       $('#imgd').attr('src','img/no-foto.png');
       
        
        
       myApp.alert('Mascota agregada', 'Animal Finder', function(){
           window.location = "main-init.html";
     });
    }else{
        myApp.alert('La imagen no se a guardado en el servidor', 'Animal Finder');
    }
    
}

function fail(error) {
    myApp.hidePreloader();
    console.log("A ocurrido un error: Codigo = " + error.code)
    myApp.alert("Error al subir la imagen", 'Animal Finder');
}

function error(){
    console.log("ERROR");
}

         
function iniciar_session(){
     var user = $('#user').val();
    var pass = $('#pass').val();

      myApp.showPreloader('Iniciando sesión...');
      $.ajax({
          dataType: 'json',
          type: 'POST',
          data: {
              nombreUser: user,
              pass: pass,
              
          },
          url: 'http://servicioswebmoviles.hol.es/index.php/WS_LOGIN',
          success: function (data, status, xhr) {
              if(data.valido){
                  console.log("Logeado");
                  localStorage.setItem('id',data.idUsuario);
                  localStorage.setItem('nombre_completo',data.nombre_completo);
                  localStorage.setItem('email',data.email);
                  localStorage.setItem('direccion',data.direccion);
                  myApp.hidePreloader();
                  conn_success();
              }else{
                  myApp.hidePreloader();
                  myApp.alert('Datos Erroneos','Animal Finder');;
              }
          },
          error: function (xhr, status) {
              myApp.hidePreloader();
              myApp.alert('Error en la conexión','Animal Finder');
          }
      });
    

}
function conn_success(){
        window.location = "main-init.html";

}


function registro(){
    window.location = "registro.html";
}
function back(){
  window.location = "login.html";  
}
function login(){
    window.location = "login.html";  
}
function iniciar_sessio(){
    var icon_name = '<i class="f7-icons" style="font-size:14px;">person</i>';
    var icon_mail = '<i class="f7-icons" style="font-size:14px;">email</i>';

    var nombreuser  = $("#username").val();
    var pass    = $("#password").val();

    if(nombreuser.trim().length > 0 && pass.trim().length > 0){
        myApp.showPreloader("Iniciando Sesión...");
        $.ajax({
            dataType: "json",
            type: "POST",
            data:{
                user: nombreuser,
                pass: pass
            },
            url: "http://servicioswebmoviles.hol.es/index.php/WS_LOGIN",
            success: function(respuesta){
                if(respuesta.resp === true){
                    $("#nosesion").hide();
                    $("#sesion").show();
                    $("#name").html(icon_name +" "+ respuesta.data.nombre);
                    $("#nombreuser").html(icon_mail +" "+ nombreuser);
                    myApp.hidePreloader();
                    myApp.closeModal(".login-screen", true);
                }else{
                    myApp.hidePreloader();
                    myApp.alert("Error en los datos de sesión", "Animal Finder");
                }
            },
            error: function(){
                myApp.hidePreloader();
                myApp.alert("Error en la Conexión", "Animal Finder");
            }
        });
    }else{
        myApp.alert("No hay datos ingresados", "Animal Finder");
    }
}
