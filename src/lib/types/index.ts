import HeatmapTile from "@petyaogurkin/ol-heatmap-tile";
import { Feature, MapBrowserEvent } from "ol";
import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import WebGLTileLayer, { Style } from "ol/layer/WebGLTile";
import { ImageWMS, TileWMS } from "ol/source";
import VectorSource from "ol/source/Vector";

export type MapPropsType = {
  center?: Coordinate;
  zoom?: number;
  init?: {
    center?: Coordinate;
    zoom?: number;
  };
  constrainResolution?: boolean;
  minZoom?: number;
  maxZoom?: number;
  fit?: Extent;
};

export type LayerBasePropsType = {
  opacity?: number;
  zIndex?: number;
  visible?: boolean;
  extent?: Extent;
  minResolution?: number;
  maxResolution?: number;
  properties?: { [x: string]: any };
};

export type WMSLayerBasePropsType = {
  url: string;
  tiled?: boolean;
  params: { [x: string]: any };
};

export type WebGLWMSLayerBasePropsType = {
  url: string;
  style: Style;
  params: { [x: string]: any };
};

export type MapEvents = {
  click?: EventFunction;
  pointermove?: EventFunction;
};

export type VectorLayerEvents = {
  click?: (feature: Feature, originalEvent: MapBrowserEvent<MouseEvent>) => void;
  pointermove?: (layer: VectorLayer<VectorSource>, originalEvent: MapBrowserEvent<MouseEvent>) => void;
  contextmenu?: (feature: Feature, originalEvent: MouseEvent) => void;
};

export type WebGLClickEvent = (layer: WebGLTileLayer | HeatmapTile, originalEvent: MapBrowserEvent<any>) => void;

export type WMSClickEvent = (layer: TileLayer<TileWMS> | ImageLayer<ImageWMS>, originalEvent: MapBrowserEvent<any>) => void;

export type WebGLLayerEvents = {
  click?: WebGLClickEvent;
};

export type WMSLayerEvents = {
  click?: WMSClickEvent;
};

export type EventFunction = (e: MapBrowserEvent<any>) => void;

export type MapEventTypes = "click" | "pointermove";
