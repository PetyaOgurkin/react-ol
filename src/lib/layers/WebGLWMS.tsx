import TileLayer from "ol/layer/WebGLTile";
import OlTileWMS from "ol/source/TileWMS";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../MapContext";
import { useLayerBasePropsRefresh, useWMSLayerBasePropsRefresh, useWebGLLayerEvents } from "../hooks";
import { LayerBasePropsType, WebGLWMSLayerBasePropsType, WebGLClickEvent } from "../types";

type Props = LayerBasePropsType &
  WebGLWMSLayerBasePropsType & {
    children?: any;
    onClick?: WebGLClickEvent;
  };

export function WebGLWMS({
  children,
  url,
  params,
  extent,
  maxResolution,
  minResolution,
  onClick,
  opacity,
  zIndex,
  visible,
  properties,
  style,
}: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<TileLayer>();

  useEffect(() => {
    if (map) {
      const layerObj = new TileLayer({
        source: new OlTileWMS({
          url,
          params,
          crossOrigin: "anonymous",
        }),
        style,
        extent,
        maxResolution,
        minResolution,
        opacity,
        zIndex,
        properties,
        visible,
      });

      map.addLayer(layerObj);
      setLayer(layerObj);

      return () => {
        if (layerObj) {
          map.removeLayer(layerObj);
        }
      };
    }
  }, [map]);

  useLayerBasePropsRefresh(layer, { extent, maxResolution, minResolution, opacity, zIndex, properties, visible });
  useWMSLayerBasePropsRefresh(layer, { params, url });
  useWebGLLayerEvents(
    map,
    layer,
    useMemo(() => ({ click: onClick }), [onClick])
  );

  useEffect(() => {
    if (layer && style) {
      layer.setStyle(style);
    }
  }, [style]);

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
