import TileLayer from "ol/layer/Tile";
import OlTileWMS from "ol/source/TileWMS";
import { useContext, useEffect, useState } from "react";
import { useLayerBasePropsRefresh } from "../hooks";
import { useWMSLayerBasePropsRefresh } from "../hooks";
import { MapContext } from "../MapContext";
import { LayerBasePropsType, WMSLayerBasePropsType } from "../types";

type Props = LayerBasePropsType &
  WMSLayerBasePropsType & {
    children?: any;
  };

export function TileWMS({ children, url, params, extent, maxResolution, minResolution, opacity, zIndex, visible, properties }: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<TileLayer<OlTileWMS>>();

  useEffect(() => {
    if (map) {
      const layerObj = new TileLayer({
        source: new OlTileWMS({
          url,
          params,
          crossOrigin: "anonymous",
        }),
        opacity,
        zIndex,
        visible,
        properties,
        minResolution,
        maxResolution,
        extent,
      });

      map.addLayer(layerObj);
      setLayer(layerObj);

      return () => {
        map.removeLayer(layerObj);
      };
    }
  }, [map]);

  useLayerBasePropsRefresh(layer, { extent, maxResolution, minResolution, opacity, zIndex, properties, visible });
  useWMSLayerBasePropsRefresh(layer, { params, url });

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
