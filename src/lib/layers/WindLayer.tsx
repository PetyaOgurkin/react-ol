import { IWindOptions, WindLayer as OlWindLayer } from "ol-wind";
import TileGrid from "ol/tilegrid/TileGrid";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../MapContext";
import { imgToArray } from "../utils/imgToArray";

type Props = {
  children?: any;
  extent: number[];
  url: {
    u: string;
    v: string;
  };
  tileGrid?: TileGrid;
  projection?: string;
  windProps: Partial<IWindOptions>;
};

type Header = {
  dx: number;
  dy: number;
  la1: number;
  la2: number;
  lo1: number;
  lo2: number;
  nx: number;
  ny: number;
  parameterCategory: number;
  parameterNumber: number;
  parameterNumberName: "U-component_of_wind" | "V-component_of_wind";
};

type Data = { header: Header; data: Float32Array }[];

export function WindLayer({ children, windProps, extent, url, projection, tileGrid }: Props) {
  const { map } = useContext(MapContext);
  const [layer, setLayer] = useState<OlWindLayer>();

  const [data, setData] = useState<Data>();

  useEffect(() => {
    Promise.all([imgToArray(url.u), imgToArray(url.v)]).then((data) => {
      const res: Data = [
        {
          header: {
            dx: (extent[2] - extent[0]) / data[0].width,
            dy: (extent[3] - extent[1]) / data[0].height,
            la1: extent[1],
            la2: extent[3],
            lo1: extent[0],
            lo2: extent[2],
            nx: data[0].width,
            ny: data[0].height,
            parameterCategory: 2,
            parameterNumber: 2,
            parameterNumberName: "U-component_of_wind",
          },
          data: data[0].data,
        },
        {
          header: {
            dx: (extent[2] - extent[0]) / data[0].width,
            dy: (extent[3] - extent[1]) / data[0].height,
            la1: extent[1],
            la2: extent[3],
            lo1: extent[0],
            lo2: extent[2],
            nx: data[1].width,
            ny: data[1].height,
            parameterCategory: 2,
            parameterNumber: 3,
            parameterNumberName: "V-component_of_wind",
          },

          data: data[1].data,
        },
      ];

      setData(res);
    });
  }, [JSON.stringify({ url, extent })]);

  useEffect(() => {
    if (!map || !data) return;

    if (layer) return;

    const layerObj = new OlWindLayer(data, {
      ...windProps,
      projection,
      tileGrid,
    });

    const zoom = map.getView().getZoom()! < 2 ? 2 : map.getView().getZoom()!;

    layerObj.setWindOptions({
      velocityScale: 1 / zoom ** 3.5,
    });

    map.addLayer(layerObj);

    const zoomHandler = () => {
      const zoom = map.getView().getZoom()! < 2 ? 2 : map.getView().getZoom()!;

      layerObj?.setWindOptions({
        velocityScale: 1 / zoom ** 3.5,
      });
    };

    map.on("moveend", zoomHandler);

    setLayer(layerObj);
  }, [map, data]);

  useEffect(() => {
    return () => {
      if (map && layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, layer]);

  useEffect(() => {
    layer?.setData(data);
  }, [data]);

  useEffect(() => {
    layer?.setWindOptions(windProps);
  }, [JSON.stringify(windProps)]);

  return <MapContext.Provider value={{ map, layer }}>{children}</MapContext.Provider>;
}
