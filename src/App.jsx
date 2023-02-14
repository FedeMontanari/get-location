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
import { Icon } from "leaflet";

function App() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 51.5,
    lng: -0.1,
    acc: 0,
  });
  const [isLocation, setIsLocation] = useState(false);

  const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.locate({ enableHighAccuracy: true });
        map.fitBounds([
          currentLocation.lat - currentLocation.acc,
          currentLocation.lng - currentLocation.acc,
        ]);
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
      <Marker position={[currentLocation.lat, currentLocation.lng]} icon={icon}>
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
