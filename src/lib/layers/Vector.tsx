import { Collection, MapBrowserEvent } from "ol";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { ProjectionLike } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { StyleLike } from "ol/style/Style";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../MapContext";
import { useLayerBasePropsRefresh, useVectorLayerEvenets } from "../hooks";
import { LayerBasePropsType } from "../types";

type Props = LayerBasePropsType & {
  children?: any;
  url?: string;
  dataProjection?: ProjectionLike;
  featureProjection?: ProjectionLike;
  features?: Feature<Geometry>[] | Collection<Feature<Geometry>>;
  style?: StyleLike | null;
  onClick?: (feature: Feature, originalEvent: MapBrowserEvent<MouseEvent>) => void;
  onPointermove?: (layer: VectorLayer<VectorSource>, originalEvent: MapBrowserEvent<MouseEvent>) => void;
  onContextmenu?: (feature: Feature, originalEvent: MouseEvent) => void;
};

export function Vector({
  children,
  dataProjection,
  extent,
  featureProjection,
  features,
  maxResolution,
  minResolution,
  onClick,
  onPointermove,
  onContextmenu,
  opacity,
  properties,
  style,
  url,
  visible,
  zIndex,
}: Props) {
  const { map } = useContext(MapContext);

  const [layer, setLayer] = useState<VectorLayer<VectorSource> | undefined>();

  useEffect(() => {
    if (map) {
      const layerObj = new VectorLayer({
        source: new VectorSource({
          url,
          format: new GeoJSON({ dataProjection, featureProjection }),
          features,
        }),
        extent,
        maxResolution,
        minResolution,
        opacity,
        properties,
        zIndex,
        visible,
      });
      map.addLayer(layerObj);
      setLayer(layerObj);

      return () => {
        map.removeLayer(layerObj);
      };
    }
  }, [map]);

  useEffect(() => {
    layer?.setStyle(style);
  }, [style, layer]);

  useLayerBasePropsRefresh(layer, { extent, maxResolution, minResolution, opacity, properties, zIndex, visible });
  useVectorLayerEvenets(map, layer, { click: onClick, pointermove: onPointermove, contextmenu: onContextmenu });

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
