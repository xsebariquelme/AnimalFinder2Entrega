// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

document.addEventListener('deviceready', function(){
    $('#name').html('<b>' + localStorage.getItem('nombre') + '</b>');
    $('#mail').html('<b>' + localStorage.getItem('mail') + '</b>');
    $('#geo').bind('click', geo);
    $('#clima').bind('click', clima);
    $('#cam').bind('click', cam);
}, false);

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

function clima(){
    myApp.showPreloader('Localizando...');
    navigator.geolocation.getCurrentPosition(
        function(position){
            $.ajax({
                dataType: 'json',
                type: 'GET',
                data: {
                    APPID: "d877cde7828d8d2cfe420ac7f129858f",
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    units: "metric",
                    lang: "es"
                },
                url: 'http://api.openweathermap.org/data/2.5/weather',
                success: function (data, status, xhr) {
                    $('#city').html(data.name+', '+data.sys.country);
                    $('#cli').html(data.weather[0].description);
                    $('#velo').html(data.wind.speed+" m/seg");
                    $('#temp').html(data.main.temp+"ºC");
                    $('#max-temp').html(data.main.temp_max+"ºC");
                    $('#min-temp').html(data.main.temp_min+"ºC");
                    $('#img_icon').attr('src','http://openweathermap.org/img/w/'+data.weather[0].icon+'.png')
                },
                error: function (xhr, status) {
                    myApp.hidePreloader();
                    myApp.alert('Datos Incorrectos','Animal Finder');
                }
            });
            myApp.hidePreloader();
            myApp.popup('.popup-clima');
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

function cam(){
    navigator.camera.getPicture(function(photo){
        $('#img_cam').attr('src',photo);
        myApp.popup('.popup-cam');
    }, function(error){
        myApp.alert('Error al tomar la fotografía','Animal Finder')
    }, {
        quality:100
    });
}