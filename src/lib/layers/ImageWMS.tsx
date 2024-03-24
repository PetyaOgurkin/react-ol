import ImageLayer from "ol/layer/Image";
import OlImageWMS from "ol/source/ImageWMS";
import { useContext, useEffect, useState } from "react";
import { useLayerBasePropsRefresh } from "../hooks";
import { useWMSLayerBasePropsRefresh } from "../hooks";
import { MapContext } from "../MapContext";
import { LayerBasePropsType, WMSLayerBasePropsType } from "../types";

type Props = LayerBasePropsType &
  WMSLayerBasePropsType & {
    children?: any;
  };

export function ImageWMS({ children, url, params, extent, maxResolution, minResolution, opacity, zIndex, visible, properties }: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<ImageLayer<OlImageWMS>>();

  useEffect(() => {
    if (map) {
      const layerObj = new ImageLayer({
        source: new OlImageWMS({
          url,
          params,
          crossOrigin: "anonymous",
        }),
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
