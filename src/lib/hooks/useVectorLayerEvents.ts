import { Feature, Map, MapBrowserEvent } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useEffect } from "react";
import { VectorLayerEvents } from "../types";

export function useVectorLayerEvenets(
  map: Map | undefined,
  layer: VectorLayer<VectorSource> | undefined,
  { click, contextmenu, pointermove }: VectorLayerEvents
) {
  //click
  useEffect(() => {
    if (!map || !layer || !click) return;

    const clickFunction = async (event: MapBrowserEvent<MouseEvent>) => {
      const features = await layer.getFeatures(event.pixel);
      features.forEach((feature) => click(feature as Feature, event));
    };

    map.on("click", clickFunction);

    return () => {
      map.un("click", clickFunction);
    };
  }, [map, layer, click]);

  //pointermove
  useEffect(() => {
    if (!map || !layer || !pointermove) return;

    const pointermoveFunction = async (event: MapBrowserEvent<MouseEvent>) => {
      const features = await layer.getFeatures(event.pixel);
      if (features.length) {
        pointermove(layer, event);
      }
    };

    map.on("pointermove", pointermoveFunction);

    return () => {
      map.un("pointermove", pointermoveFunction);
    };
  }, [map, layer, pointermove]);

  //contextmenu
  useEffect(() => {
    if (!map || !layer || !contextmenu) return;

    const contextmenuFunction = async (event: MouseEvent) => {
      const features = await layer.getFeatures([event.x, event.y]);
      features.forEach((feature) => {
        event.preventDefault();
        contextmenu(feature as Feature, event);
      });
    };

    map.getViewport().addEventListener("contextmenu", contextmenuFunction);

    return () => {
      map.getViewport().removeEventListener("contextmenu", contextmenuFunction);
    };
  }, [map, layer, contextmenu]);
}
