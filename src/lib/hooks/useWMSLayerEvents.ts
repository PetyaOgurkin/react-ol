import { useEffect } from "react";
import { Map, MapBrowserEvent } from "ol";
import { WMSLayerEvents } from "../types";
import TileLayer from "ol/layer/Tile";
import { ImageWMS, TileWMS } from "ol/source";
import ImageLayer from "ol/layer/Image";

export function useWMSLayerEvenets(map: Map | undefined, layer: TileLayer<TileWMS> | ImageLayer<ImageWMS> | undefined, events: WMSLayerEvents) {
  //click
  useEffect(() => {
    if (map && layer && events.click) {
      const clickFunction = (e: MapBrowserEvent<any>) => {
        const layerData = layer.getData(e.pixel) as Uint8ClampedArray;
        if (layerData && layerData[3] > 0) {
          if (events.click) {
            events.click(layer, e);
          }
        }
      };
      map.on("click", clickFunction);

      return () => {
        map.un("click", clickFunction);
      };
    }
  }, [map, layer, events.click]);
}
