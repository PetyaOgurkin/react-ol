import { Map } from "ol";
import { WindLayer } from "ol-wind";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import WebGLTileLayer from "ol/layer/WebGLTile";
import { ImageWMS, TileWMS, XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import React from "react";

type Layer = VectorLayer<VectorSource> | TileLayer<TileWMS | XYZ> | ImageLayer<ImageWMS> | WebGLTileLayer | WindLayer;

type MapContextType = {
  map?: Map;
  layer?: Layer;
};

export const MapContext = React.createContext({} as MapContextType);
