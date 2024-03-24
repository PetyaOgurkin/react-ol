import { HeatmapTileOptions } from "@petyaogurkin/ol-heatmap-tile";
import OlHeatmapTile from "@petyaogurkin/ol-heatmap-tile/dist/index";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../MapContext";
import { useLayerBasePropsRefresh, useWebGLLayerEvents } from "../hooks";
import { WebGLClickEvent } from "../types";

type Props = HeatmapTileOptions & {
  children?: any;
  onClick?: WebGLClickEvent;
};

export function HeatmapTile({ children, webGLTileProps, onClick, ...props }: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<OlHeatmapTile>();

  useEffect(() => {
    if (!map) return;

    const layerObj = new OlHeatmapTile({
      ...props,
      webGLTileProps,
    });

    map.addLayer(layerObj);
    setLayer(layerObj);
    return () => {
      map.removeLayer(layerObj);
    };
  }, [map]);

  useLayerBasePropsRefresh(layer, webGLTileProps || {});

  useEffect(() => {
    if (!layer) return;
    layer.updateProps(props);
  }, [layer, JSON.stringify(props)]);

  useWebGLLayerEvents(
    map,
    layer,
    useMemo(() => ({ click: onClick }), [onClick])
  );

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
