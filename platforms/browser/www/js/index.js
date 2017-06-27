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
    $("#registrarcuenta").bind("click",registrarcuenta);
    $("#back").bind("click",back);
	$('#pet1').bind('click', notificacion);
	$('#pet2').bind('click', notificacion);
    $('#nombre_user_session').html('<b>Hola ' + localStorage.getItem('nombre_completo') + '</b>');
    $('#tosend').bind('click', enviada);
    $('#cerrarsesion').bind('click', cerrarsesion);

});

function cerrarsesion(){
        window.location = "index.html";

}



function enviada(){
     myApp.alert('Mascota agregada', 'Animal Finder', function(){
           window.location = "main-init.html";
     });
  
   
}
function notificacion(){
	myApp.alert('Se ha enviado una notificación al dueño','Animal Finder');
}
function registrarcuenta(){
    
    
}
function gotoindex(){
      window.location = "index.html";  

}
function uploadPhoto1(imageURI){
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    
    var params = new Object();
    params.value1="test";
    params.value2="param";
    
    options.params=params;
    options.chunkedMode= false;
    
    var ft = new FileTransfer();
    ft.upload(imageURI, "http://servicioswebmoviles.hol.es/index.php/WS_REGISTRARMASCOTA",win,fail);
    
}
function uploadPhoto() {
    if($('#imgd').attr('src') != ''){
		var id = localStorage.getItem('id');
        var imageURI = $('#imgd').attr('src');
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var params = new Object();
        params.nombre = "FOTO TEST";
		params.ID_USUARIO=id;
		params.descripcion='foto test descripcion'
		
        options.params = params;
        options.chunkedMode = false;
        
        myApp.showPreloader('Registrando...');
        
        var ft = new FileTransfer();
        ft.upload(imageURI, "http://servicioswebmoviles.hol.es/index.php/WS_REGISTRARMASCOTA", win, fail, options);
    }else{
        myApp.alert('No hay foto');
    }
}
function win(r) {
    myApp.hidePreloader();
    var json = JSON.parse(r.response);
    
    if(json.respuesta){
        localStorage.setItem('idperdida', json.IdPerdida);
		localStorage.setItem('idMascota', json.IdMascota);
       // $('#imgd').attr('src','img/no-foto.png');
        myApp.alert('Imagen Subida exitosamente');
    }else{
        myApp.alert('La imagen no se a guardado en el servidor');
    }
    
}

function fail(error) {
    myApp.hidePreloader();
    console.log("An error has occurred: Code = " + error.code)
    myApp.alert("Error al subir la imgaen");
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
                  myApp.alert('Datos Erroneos','Error');;
              }
          },
          error: function (xhr, status) {
              myApp.hidePreloader();
              myApp.alert('Datos Incorrectos2','Error');
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

function camara(){
    navigator.camera.getPicture(uploadPhoto,function(photo){
        $('#img_cam').attr('src',photo);

    }, function(error){
        myApp.alert('Error al tomar la fotografía','Animal Finder')
    }, {
        quality:100,
        correctOrientation: true
    });
}
