import HeatmapTile from "@petyaogurkin/ol-heatmap-tile";
import { Map, MapBrowserEvent } from "ol";
import WebGLTileLayer from "ol/layer/WebGLTile";
import { useEffect } from "react";
import { WebGLLayerEvents } from "../types";

export function useWebGLLayerEvents(map: Map | undefined, layer: WebGLTileLayer | HeatmapTile | undefined, events: WebGLLayerEvents) {
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
