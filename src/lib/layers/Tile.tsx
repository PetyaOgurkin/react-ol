import TileLayer from "ol/layer/Tile";
import { ProjectionLike } from "ol/proj";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";
import { useContext, useEffect, useState } from "react";
import { useLayerBasePropsRefresh } from "../hooks";
import { MapContext } from "../MapContext";
import { LayerBasePropsType } from "../types";

type Props = LayerBasePropsType & {
  children?: any;
  url: string;
  tileGrid?: TileGrid;
  projection?: ProjectionLike;
};

export function Tile({ children, url, extent, opacity, zIndex, visible, properties, tileGrid, projection, maxResolution, minResolution }: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<TileLayer<XYZ>>();

  useEffect(() => {
    if (!map) return;

    const layerObj = new TileLayer({
      source: new XYZ({ url, tileGrid, projection }),
      extent,
      opacity,
      zIndex,
      visible,
      properties,
      maxResolution,
      minResolution,
    });

    map.addLayer(layerObj);
    setLayer(layerObj);
    return () => {
      map.removeLayer(layerObj);
    };
  }, [map]);

  useLayerBasePropsRefresh(layer, { extent, opacity, zIndex, visible, properties, maxResolution, minResolution });

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
