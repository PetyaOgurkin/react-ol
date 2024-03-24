import { MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "./MapContext";

type Props = {
  onPointermove: (layers: Layer[], originalEvent: MapBrowserEvent<MouseEvent>) => ReactNode;
};

export function Tooltip({ onPointermove }: Props) {
  const { map } = useContext(MapContext);

  const [position, setPosition] = useState<number[]>([0, 0]);
  const [content, setContent] = useState<ReactNode>();
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;
    const tooltipFunction = (evt: MapBrowserEvent<any>) => {
      const layers = map.getAllLayers().filter((layer) => layer.getData(evt.pixel));

      map.forEachFeatureAtPixel(evt.pixel, (_, layer) => {
        layers.push(layer);
      });

      setPosition(evt.pixel);
      setContent(onPointermove(layers, evt));
    };

    const viewport = map.getViewport();
    const overlayContainer = map.getOverlayContainerStopEvent();

    const mouseout = () => setContent(undefined);
    const mouseover = () => setVisible(false);
    const mouseleave = () => setVisible(true);

    map.on("pointermove", tooltipFunction);
    viewport.addEventListener("mouseout", mouseout);
    overlayContainer.addEventListener("mouseover", mouseover);
    overlayContainer.addEventListener("mouseleave", mouseleave);

    return () => {
      map.un("pointermove", tooltipFunction);
      viewport.removeEventListener("mouseout", mouseout);
      overlayContainer.removeEventListener("mouseover", mouseover);
      overlayContainer.removeEventListener("mouseleave", mouseleave);
    };
  }, [map]);

  if (!content || !visible) return <></>;

  const rect = map?.getViewport().getBoundingClientRect();

  if (!rect) return <></>;

  const x = position[0] + rect.x;
  const y = position[1] + rect.y;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        display: content ? "block" : "none",
        padding: 5,
        zIndex: 1,
        [x + (containerRef.current?.clientWidth || 0) + 15 > rect.x + rect.width ? "right" : "left"]:
          x + (containerRef.current?.clientWidth || 0) + 15 > rect.x + rect.width ? window.innerWidth - x + 5 : x + 15,
        [y + (containerRef.current?.clientHeight || 0) > rect.y + rect.height ? "bottom" : "top"]:
          y + (containerRef.current?.clientHeight || 0) > rect.y + rect.height ? window.innerHeight - y : y,
      }}
    >
      {content}
    </div>
  );
}
