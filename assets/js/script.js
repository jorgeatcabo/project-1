// curl "https://test.api.amadeus.com/v1/security/oauth2/token" \
//      -H "Content-Type: application/x-www-form-urlencoded" \
//      -d "grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}"

//Adding click events to button for searching
$(".city-button").click(function(){
    var city = $(".city-search").val();
    fillElement(city)
});

function fillElement(city){  
    $.ajax({
        type: "POST",
        url: "https://test.api.amadeus.com/v1/security/oauth2/token",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
            "grant_type": "client_credentials",
            "client_id":"FKZeuFyayvSaFhNQo2ZcskF185nKrqLV",
            "client_secret":"wB0WlfAyQCUHTQFB"
        },
        success: function(data) {
          var token=data.access_token
          var url = "https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode="+city;
          //https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=48.85254&longitude=2.34198
          var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.setRequestHeader("Authorization", 'Bearer '+token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {                
                    var hotels = (JSON.parse(xhr.responseText));
                    var i;
                    var hotelContainer=document.getElementById("cards")
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
                        var hotelNombre=hotels.data[i].hotel.name
                        hotelNombre=hotelNombre.trim()
                        console.log(hotelNombre)
                        accordion.setAttribute('id', hotelNombre);
                        
                        // var poiUrl='https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude='+hotels.data[i].hotel.latitude+'&longitude='+hotels.data[i].hotel.longitude;
                        var poiUrl="https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=48.85254&longitude=2.34198";
                        var poiXhr = new XMLHttpRequest();
                        poiXhr.open("GET", poiUrl);
                        poiXhr.setRequestHeader("Authorization", 'Bearer 7stf0Vd2oeN7TjGihLV3HwHGReXW');
                        console.log(poiXhr)
                        poiXhr.onreadystatechange = function () {
                        if (poiXhr.readyState === 4) {    
                            var pois = (JSON.parse(poiXhr.responseText));
                            console.log(pois)
                            var a;
                            var out=""
                        for(a = 0; a < pois.data.length; a++) {
                        out += '<li class="accordion-item is-active" data-accordion-item>' +
                        '<a href="#" class="accordion-title">'+pois.data[a].name+'</a>'+
                        '</li>';
                        }
                        console.log(out)
                        document.getElementById(hotelNombre).innerHTML = out;
                        }   
                    };
                    poiXhr.send(); 
                    
                        // out += '<div class="card" style="width: 100%;"' +
                        // '<div id="card-header" class="card-divider">'+
                        // hotels.data[i].hotel.name
                        // '</div>'+
                        // '<div class="card-section"></div>'+
                        // '</div>';
                    //console.log(out)
                    //document.getElementById("cards").append(out)              
                    
                    
                    }
                }
            };
            xhr.send();                        
        },
        dataType: "json"
      });      
} 


