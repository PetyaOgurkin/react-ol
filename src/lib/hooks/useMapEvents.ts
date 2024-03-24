import { Map } from "ol";
import { useEffect } from "react";
import { MapEvents } from "../types";

export function useMapEvents(map: Map | undefined, events: MapEvents) {
  useEffect(() => {
    if (!map) return;

    Object.entries(events).forEach(([event, callback]) => {
      if (callback) {
        map.on(event as keyof MapEvents, callback);
      }
    });

    return () => {
      Object.entries(events).forEach(([event, callback]) => {
        if (callback) {
          map.un(event as keyof MapEvents, callback);
        }
      });
    };
  }, [map, events]);
}
