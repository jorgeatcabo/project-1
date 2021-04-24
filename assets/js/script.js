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
    var result=true
    result=searchFlightOffers(originCity,destinationCity,maxFlights,depDate)
    if (result){
        searchHotel(destinationCity)
    }
});


function searchFlightOffers(origin,destination,max,departureDate){  
    showSpinner()
    $.ajax({
        type: "POST",
        url: "https://test.api.amadeus.com/v1/security/oauth2/token",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
            "grant_type": "client_credentials",
            "client_id":"g74uwdzCBnGRJAPXHD0qN4oFECb0ACTS",
            "client_secret":"rHXwsbMdgjIDrQFK"
        },
        success: function(data) {
          var token=data.access_token
          var url="https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode="+origin.toUpperCase()+"&destinationLocationCode="+destination.toUpperCase()+"&departureDate="+departureDate+"&adults=1&nonStop=true&max="+max
          var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onloadend = function() {
                if(xhr.status === 404 || xhr.status === 400){ 
                    $("#modal-button-error").click()
                     hideSpinner()
                    throw new Error(url);
                }
            }  
            xhr.setRequestHeader("Authorization", 'Bearer '+token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4  && xhr.status==200) {                
                    var flights = (JSON.parse(xhr.responseText));
                    if (flights.data.length==0){
                        $("#modal-button-not-found").click()
                        hideSpinner()
                        return false
                    }
                    var out=""
                    for(a = 0; a < flights.data.length; a++) {
                        out +=flights.data[a].itineraries[0].segments[0].departure.iataCode+" "+flights.data[a].itineraries[0].segments[0].departure.at+"-------->"+flights.data[a].itineraries[0].segments[0].arrival.iataCode+" "+ flights.data[a].itineraries[0].segments[0].arrival.at+'<br/>';
                    }
                     document.getElementById("origin-destination").innerHTML = origin.toUpperCase()+"-------->"+destination.toUpperCase()+" "+departureDate;
                     document.getElementById("flights-content").innerHTML = out;  
                    hideSpinner()
                   
                }
                
            };
            xhr.send();
        },
        dataType: "json"
      });  
      return true    
} 

function searchHotel(city){  
    showSpinner()
    $.ajax({
        type: "POST",
        url: "https://test.api.amadeus.com/v1/security/oauth2/token",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
            "grant_type": "client_credentials",
            "client_id":"g74uwdzCBnGRJAPXHD0qN4oFECb0ACTS",
            "client_secret":"rHXwsbMdgjIDrQFK"
        },
        success: function(data) {
          var token=data.access_token
          var url = "https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode="+city;
          var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.setRequestHeader("Authorization", 'Bearer '+token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {                
                    var hotels = (JSON.parse(xhr.responseText));
                    var hotelContainer=document.getElementById("cards")
                    hotelContainer.innerHTML=""
                    $(hotelContainer).empty()
                    var idHotel=""
                    for(i = 0; i < hotels.data.length; i++) { 
                        var card = document.createElement('div');
                        var cardHeader=document.createElement('div');
                        hotelContainer.append(card);
                        card.classList.add("card");
                        card.append(cardHeader);
                        cardHeader.classList.add("card-divider");
                        cardHeader.textContent = hotels.data[i].hotel.name
                        // card.append(cardSection);
                        // cardSection.classList.add("card-section");
                        // cardSection.append(accordion);
                        // accordion.classList.add("accordion");
                        // idHotel=hotels.data[i].hotel.name
                        // idHotel=idHotel.replace(/\s/g, '');
                        // accordion.setAttribute('id', idHotel);
                    }
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

