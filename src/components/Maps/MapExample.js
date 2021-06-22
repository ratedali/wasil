import React from "react";
import firebase from "firebase";


async function getMarker(map, google ) {
  const snapshot = await firebase.firestore().collection('fuelOrders').get()
  var orders = snapshot.docs.map(doc => doc.data());
  var markersList = []
  for (let i = 0 ; i < orders.length; i++) {
    var lat = orders[i].dropLocation._lat 
    var long = orders[i].dropLocation._long
    const latlong = new google.maps.LatLng(lat, long);
    const marker = new google.maps.Marker({position: latlong, map: map, animation: google.maps.Animation.DROP, title: "Notus React!",});
    if(orders[i].status == "finished" ){
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
    }
    else if(orders[i].status == "rejected" ){
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
    }
    else if(orders[i].status == "in-progress" ){
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
    }
    else {
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
    }
    marker.addListener("click", () => {
      map.setZoom(13);
      map.setCenter(marker.getPosition());
    });



    
    markersList.push(marker)

  }

  return markersList

}

function MapExample() {


  /////////////////////
  // getListOfOrders
  
  //
  ///////////////////////////////////


  const mapRef = React.useRef(null);
  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current;
    let latBahri = "15.6298";
    let lngBahri = "32.5424";
    const myLatlngB = new google.maps.LatLng(latBahri, lngBahri);
    
    const mapOptions = {
      zoom: 11,
      center: myLatlngB,
      scrollwheel: false,
      zoomControl: true,
      styles: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#4299e1" }, { visibility: "on" }],
        },
      ],
    };

    map = new google.maps.Map(map, mapOptions);


    getMarker(map, google)

  });
  return (
    <>
      <div className="relative w-full rounded h-600-px">
        <div className="rounded h-full" ref={mapRef} />
      </div>
    </>
  );
}

export default MapExample;
