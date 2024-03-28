import Overlay from "ol/Overlay";
import { Coordinate } from "ol/coordinate";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "./MapContext";

type Props = {
  children?: ReactNode;
  position?: Coordinate;
};

export function Popup({ children, position }: Props) {
  const { map } = useContext(MapContext);

  const [popup, setPopup] = useState<Overlay>();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !map) return;

    const popupInstance = new Overlay({
      element: containerRef.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(popupInstance);

    setPopup(popupInstance);

    return () => {
      map.removeOverlay(popupInstance);
    };
  }, [map]);

  useEffect(() => {
    popup?.setPosition(position);
  }, [popup, position]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: 12,
        left: -50,
      }}
    >
      {children}
    </div>
  );
}
