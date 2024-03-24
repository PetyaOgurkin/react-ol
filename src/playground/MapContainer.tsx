import { View } from "ol";
import "ol/ol.css";
import { Map, Tile } from "src/lib";

export default function MapContainer() {
  return (
    <>
      <Map
        style={{ width: "100dvw", height: "100dvh" }}
        view={
          new View({
            center: [0, 0],
            zoom: 5,
          })
        }
      >
        <Tile url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </Map>
    </>
  );
}
