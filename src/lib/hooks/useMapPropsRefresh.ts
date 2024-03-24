import { useEffect } from "react";
import { MapPropsType } from "../types";
import { Map } from "ol";

export function useMapPropsRefresh(map: Map | undefined, { center, zoom }: MapPropsType) {
  useEffect(() => {
    if (!map || !center) return;
    map.getView().setCenter(center);
  }, [center]);

  useEffect(() => {
    if (!map || !zoom) return;
    map.getView().setZoom(zoom);
  }, [zoom]);
}
