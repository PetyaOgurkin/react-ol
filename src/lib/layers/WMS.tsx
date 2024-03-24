import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import OlImageWMS from "ol/source/ImageWMS";
import OlTileWMS from "ol/source/TileWMS";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../MapContext";
import { useLayerBasePropsRefresh, useWMSLayerBasePropsRefresh, useWMSLayerEvenets } from "../hooks";
import { LayerBasePropsType, WMSClickEvent, WMSLayerBasePropsType } from "../types";

type Props = LayerBasePropsType &
  WMSLayerBasePropsType & {
    children?: any;
    onClick?: WMSClickEvent;
  };

export function WMS({
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
  tiled = false,
}: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<TileLayer<OlTileWMS> | ImageLayer<OlImageWMS>>();

  useEffect(() => {
    if (map) {
      let layerObj: TileLayer<OlTileWMS> | ImageLayer<OlImageWMS>;

      if (tiled) {
        layerObj = new TileLayer({
          source: new OlTileWMS({
            url,
            params,
            crossOrigin: "anonymous",
          }),
        });
      } else {
        layerObj = new ImageLayer({
          source: new OlImageWMS({
            url,
            params,
            crossOrigin: "anonymous",
          }),
        });
      }

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
  useWMSLayerEvenets(
    map,
    layer,
    useMemo(() => ({ click: onClick }), [onClick])
  );

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
