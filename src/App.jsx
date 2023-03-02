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
  const [currentLocation, setCurrentLocation] = useState({});
  const [isLocation, setIsLocation] = useState(false);
  const [border, setBorder] = useState([]);

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
      },
      locationfound(e) {
        setIsLocation(true);
        setCurrentLocation({
          lat: e.latitude,
          lng: e.longitude,
          acc: e.accuracy,
        });
        let accCoords =
          Number(currentLocation.acc.toString().split(".")[0]) /
          getDecimals(currentLocation.acc);
        let corner1 = [
          currentLocation.lat - accCoords,
          currentLocation.lng - accCoords,
        ];

        let corner2 = [
          currentLocation.lat + accCoords,
          currentLocation.lng + accCoords,
        ];
        setBorder([corner1, corner2]);
        map.flyTo(currentLocation);
      },
      moveend() {
        map.fitBounds(border);
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

  function getDecimals(acc) {
    let stringify = acc.toString().split(".")[0];
    switch (stringify.length) {
      case 1:
        return 1000000;
      case 2:
        return 100000;
      case 3:
        return 100000;
      case 4:
        return 100000;
      case 5:
        return 10000;
      case 6:
        return 1000;
      default:
        return;
    }
  }

  return (
    <div className="App">
      <h1 style={{ margin: 0 }}>Get your current device's location!</h1>
      <h4>Click on the map to get your location</h4>
      <div className="map" id="map">
        <MapContainer
          center={currentLocation}
          zoom={12}
          scrollWheelZoom={true}
        >
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
          <a
            href="https://github.com/FedeMontanari/get-location"
            target="_blank"
          >
            here
          </a>
          .
        </i>
      </p>
    </div>
  );
}

export default App;
