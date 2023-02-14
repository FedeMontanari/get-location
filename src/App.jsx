import "./App.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

function App() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 51.5,
    lng: -0.1,
    acc: 0,
  });
  const [isLocation, setIsLocation] = useState(false);

  // function handlePermission() {
  //   function revealPosition(pos) {
  //     setCurrentLocation({
  //       lat: pos.coords.latitude,
  //       lng: pos.coords.longitude,
  //       acc: 3842,
  //     });
  //     return;
  //   }

  //   function deniedPosition(pos) {
  //     alert(pos.message);
  //   }

  //   navigator.permissions.query({ name: "geolocation" }).then((result) => {
  //     result.onchange = () => {
  //       report(result.state);
  //     };
  //     switch (result.state) {
  //       case "prompt":
  //         navigator.geolocation.getCurrentPosition(
  //           revealPosition,
  //           deniedPosition
  //         );
  //         return;
  //       case "granted":
  //         return navigator.geolocation.getCurrentPosition(
  //           revealPosition,
  //           deniedPosition
  //         );
  //       case "denied":
  //         alert("User denied Geolocation");
  //         return;
  //       default:
  //         break;
  //     }
  //   });
  // }

  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.locate({ enableHighAccuracy: true });
      },
      locationfound(e) {
        setIsLocation(true);
        setCurrentLocation({
          lat: e.latitude,
          lng: e.longitude,
          acc: e.accuracy,
        });
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return !isLocation ? null : (
      <Marker position={[currentLocation.lat, currentLocation.lng]}>
        <FeatureGroup pathOptions={{ fillColor: "blue" }}>
          <Circle
            center={[currentLocation.lat, currentLocation.lng]}
            radius={currentLocation.acc}
          />
          <Popup>
            You are here.
            <br />
            Accuracy: {Number.parseInt(currentLocation.acc)} m.
          </Popup>
        </FeatureGroup>
      </Marker>
    );
  }

  return (
    <div className="App">
      <h1 style={{ margin: 0 }}>Get your current device's location!</h1>
      <h4>Click on the map to get your location</h4>
      <div className="map" id="map">
        <MapContainer center={currentLocation} zoom={12} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
      <p>
        <i>
          Your location doesn't get stored and it's value is lost on tab close
          or refresh.
          <br />
          Website's source code is available{" "}
          <a href="#" target="_blank">
            here
          </a>
          .
        </i>
      </p>
    </div>
  );
}

export default App;
