$(document).ready(function(){

DisplaySearchHistory()
   DefaultCity();

   function DefaultCity(){
       var url = "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=0946b5eb988b3caf2e24954f8caf2636"
             $.get(url,function(data,status){
                 console.log(data)
                 DisplayDataOnPage(data)
                 FivedaysApiCall(data.name)
             })
   }

   function DisplayDataOnPage(data){

    var icon = data.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";
    $('#icon-w').attr('src',iconUrl)

    var currentDate = new Date(data.dt * 1000).toISOString();

    var display = data.name + " (" + moment(currentDate).format("MM/D/YYYY") + ")"
    $('#cityName').text(display)

    var tempFar = parseInt((data.main.temp - 273.15)* 9/5 +32);
    //display temp on the page
    $('#temperatureSet').text(tempFar+ " °F")
    //display humidity on the page
    $('#humiditySet').text(data.main.humidity + "%")
    //display wind
    $('#windSet').text(data.wind.speed)

    var lat = data.coord.lat;
    var lon = data.coord.lon;
    $.ajax({
        method: "GET",
        url:
        "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=0946b5eb988b3caf2e24954f8caf2636&lat=" + lat + "&lon=" + lon
    }).then(function(uvdata) {
        console.log(uvdata);
        $("#uvSet").text(uvdata[0].value);
    });
   }
   $("#search-button").click(function(event){
       event.preventDefault()

       const city = $("#search-input")
       .val()
       .trim();
       console.log(city)

       var ApiUrl ="https://api.openweathermap.org/data/2.5/weather?q=" + city +"&APPID=0946b5eb988b3caf2e24954f8caf2636";

       $.ajax({
           method: "GET",
           url: ApiUrl
       }).then(function(response) {
           localStorage.setItem(city, Json.stringify(response));

           var li = $(
               '<button type='button' class='list-group-item list-group-item-action' id='${city}</li>'
           );
           li.appendTo("#search-history");

           DisplayDataOnPage(response);

           FivedaysApiCall(city);
       });
   })
   function FivedaysApiCall(city) {
       var ApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=0946b5eb988b3caf2e24954f8caf2636";
       $.ajax({
           method: "GET",
           url: ApiUrl
       }).then(function(data) {
           console.log(data);
           $("#forecast").empty();
           var forecastArray = data.list;

           forecastArray.forEach(function(forecast, index) {
               var forecastDateTxt = forecast.dt_txt;

               var forecastDate = forecastDateTxt.split(" ")[0];
               var forecastTime = forecastDateTxt.split(" ")[1];

               if (forecastTime === "00:00:000") {
                   var card;
                   if (index === forecastArray.length - 1) {
                       card = $(
                           "<div class='card bg-primary text-white col col-md-3 col-lg-2 col-sm-3 col-xs-12' style=''>"
                       );
                   }
                   const cardBody = $("<div class='card-body my-1'>");
                   const h5 = $("<h6 class= 'card-title'>")
                     .text(moment(forecastDate.trim()).format("MM/D/YYYY"))
                     .appendTo(cardBody);
                   
                    var imgUrl =
                    "https://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png";
                    const img = $("<img>")
                      .attr("src", imgUrl)
                      .attr("alt", "Weather Forecast icon")
                      .appendTo(cardBody);

                    var lineBreak = $("<br>").appendTo(cardBody);
                    var tempFar = parseInt((forecast.main.temp - 273.15)* 9/5 + 32);
                    var tempSpan = $("<span>")
                      .text('Temp: ${tempFar} °F')
                      .appendTo(cardBody);

                    var lineBreak = $("<br>").appendTo(cardBody);

                    var humiditySpan = $("<span>")
                       .text('Humidity: ${forecast.main.humidity} %')
                       .appendTo(cardBody);

                    cardBody.appendTo(card);

               }
           });
       });
   }

   function DisplaySearchHistory() {
       var cities = Object.keys(localStorage);
       console.log(cities);
       cities.forEach(function(city) {
           var li = $(
               '<button type=button' class='list-group-item list-group-item-action' id='${city}'>${city}</li>
           );
           li.appendTo("#search-history");
       });
   }
})