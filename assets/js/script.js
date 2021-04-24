// curl "https://test.api.amadeus.com/v1/security/oauth2/token" \
//      -H "Content-Type: application/x-www-form-urlencoded" \
//      -d "grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}"



hideSpinner()
//Adding click events to button for searching
$(".city-button").click(function(){
    var originCity = $(".origin-city").val();    
    var destinationCity = $(".destination-city").val();  
    var maxFlights= $(".max-flights").val();
    var depDate= $(".depature-date").val();
    searchFlightOffers(originCity,destinationCity,maxFlights,depDate)
});

function fillElement(city){  
    showSpinner()
    $.ajax({
        type: "POST",
        url: "https://api.amadeus.com/v1/security/oauth2/token",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
            "grant_type": "client_credentials",
            "client_id":"",
            "client_secret":""
        },
        success: function(data) {
          var token=data.access_token
          var url = "https://api.amadeus.com/v2/shopping/hotel-offers?cityCode="+city;
          var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.setRequestHeader("Authorization", 'Bearer '+token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {                
                    var hotels = (JSON.parse(xhr.responseText));
                    var hotelContainer=document.getElementById("cards")
                    var idHotel=""
                    var arrHotelsInfo=[]
                    for(i = 0; i < hotels.data.length; i++) { 
                        var card = document.createElement('div');
                        var cardHeader=document.createElement('div');
                        var cardSection=document.createElement('div');
                        var accordion=document.createElement('ul');
                        hotelContainer.append(card);
                        card.classList.add("card");
                        card.append(cardHeader);
                        cardHeader.classList.add("card-divider");
                        cardHeader.textContent = hotels.data[i].hotel.name
                        card.append(cardSection);
                        cardSection.classList.add("card-section");
                        cardSection.append(accordion);
                        accordion.classList.add("accordion");
                        idHotel=hotels.data[i].hotel.name
                        idHotel=idHotel.replace(/\s/g, '');
                        accordion.setAttribute('id', idHotel);
                        arrHotelsInfo.push([idHotel,hotels.data[i].hotel.latitude,hotels.data[i].hotel.longitude])                       
                    }
                    function sleep(milliseconds) {
                        const date = Date.now();
                        let currentDate = null;
                        do {
                          currentDate = Date.now();
                        } while (currentDate - date < milliseconds);
                      }                      
                   
                    for(i = 0; i < arrHotelsInfo.length; i++) {  
                        sleep(1000);                   
                        createPois(i,arrHotelsInfo,token)                    
                    }

                    hideSpinner()
                }
            };
            xhr.send();                        
        },
        dataType: "json"
      });      
} 

function createPois(index,arrHotelsInfo,token){
    var poiUrl='https://api.amadeus.com/v1/reference-data/locations/pois?latitude='+arrHotelsInfo[index][1]+'&longitude='+arrHotelsInfo[index][2];
    //var poiUrl="https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=48.85254&longitude=2.34198";
    var poiXhr = new XMLHttpRequest();
    poiXhr.open("GET", poiUrl);
    poiXhr.setRequestHeader("Authorization", 'Bearer '+token);
    poiXhr.onreadystatechange = function () {

        if (poiXhr.readyState === 4) {    
            var pois = (JSON.parse(poiXhr.responseText));
            var out=""
        
                for(a = 0; a < pois.data.length; a++) {
                    out += '<li class="accordion-item is-active" data-accordion-item>' +
                    '<a href="#" class="accordion-title">'+pois.data[a].name+'</a>'+
                    '</li>';
                }
            document.getElementById(arrHotelsInfo[index][0]).innerHTML = out;                        
        }   
    };
    poiXhr.send(); 
}

function searchFlightOffers(origin,destination,max,departureDate){  
    showSpinner()
    $.ajax({
        type: "POST",
        url: "https://api.amadeus.com/v1/security/oauth2/token",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
            "grant_type": "client_credentials",
            "client_id":"",
            "client_secret":""
        },
        success: function(data) {
          var token=data.access_token
          var url="https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode="+origin.toUpperCase()+"&destinationLocationCode="+destination.toUpperCase()+"&departureDate="+departureDate+"&adults=1&nonStop=true&max="+max
          var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onloadend = function() {
                if(xhr.status === 404 || xhr.status === 400){ 
                     alert("Flights not found..")
                     hideSpinner()
                    throw new Error(url + ' replied 404');
                }
            }  
            xhr.setRequestHeader("Authorization", 'Bearer '+token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4  && xhr.status==200) {                
                    var flights = (JSON.parse(xhr.responseText));
                    var out=""
                    for(a = 0; a < flights.data.length; a++) {
                        out +=flights.data[a].itineraries[0].segments[0].departure.iataCode+" "+flights.data[a].itineraries[0].segments[0].departure.at+"-------->"+flights.data[a].itineraries[0].segments[0].arrival.iataCode+" "+ flights.data[a].itineraries[0].segments[0].arrival.at+'<br/>';
                    }
                     document.getElementById("origin-destination").innerHTML = origin+"-------->"+destination+" "+departureDate;
                     document.getElementById("flights-content").innerHTML = out;  
                    hideSpinner()
                }
                
            };
            xhr.send();
        },
        dataType: "json"
      });      
} 

function hideSpinner() {
    document.getElementById('spinner')
            .style.display = 'none';
} 

function showSpinner() {
    document.getElementById('spinner')
            .style.display = 'block';
} 

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}