import { Map as OlMap, View } from "ol";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { MapContext } from "./MapContext";
import { ProjectionLike } from "ol/proj";
import { Extent } from "ol/extent";
import { useMapEvents } from "./hooks";
import { EventFunction, MapPropsType } from "./types";
import { useMapPropsRefresh } from "./hooks";
import Control from "ol/control/Control";

type Props = MapPropsType & {
  children?: any;
  className?: string;
  style?: React.CSSProperties;
  view?: View;
  controls?: Control[];
  projection?: ProjectionLike;
  onClick?: EventFunction;
  onPointermove?: EventFunction;
  onMoveend?: EventFunction;
};

export function Map({ children, className, style, center, zoom, view, onClick: click, onPointermove: pointermove, controls }: Props) {
  const [map, setMap] = useState<OlMap>();
  const containerId = useId();

  useEffect(() => {
    if (map) return;

    const mapInstance = new OlMap({
      target: containerId,
      view,
      controls,
    });

    setMap(mapInstance);

    return () => {
      mapInstance.setTarget("");
    };
  }, []);

  useMapPropsRefresh(map, { zoom, center });
  useMapEvents(
    map,
    useMemo(() => ({ click, pointermove }), [click, pointermove])
  );

  return (
    <MapContext.Provider value={{ map }}>
      <div id={containerId} className={className} style={style}>
        {children}
      </div>
    </MapContext.Provider>
  );
}
