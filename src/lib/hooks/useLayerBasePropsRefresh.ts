import { useEffect } from "react";
import Layer from "ol/layer/Layer";
import { LayerBasePropsType } from "../types";

export function useLayerBasePropsRefresh(
  layer: Layer | undefined,
  { extent, maxResolution, minResolution, opacity, properties, visible, zIndex }: LayerBasePropsType
) {
  // opacity
  useEffect(() => {
    if (layer && (opacity || opacity === 0)) {
      layer.setOpacity(opacity);
    }
  }, [opacity]);

  // zIndex
  useEffect(() => {
    if (layer && (zIndex || zIndex === 0)) {
      layer.setZIndex(zIndex);
    }
  }, [zIndex]);

  // extent
  useEffect(() => {
    if (layer && extent) {
      layer.setExtent(extent);
    }
  }, [JSON.stringify(extent)]);

  //minResolution
  useEffect(() => {
    if (layer && (minResolution || minResolution === 0)) {
      layer.setMinResolution(minResolution);
    }
  }, [minResolution]);

  //maxResolution
  useEffect(() => {
    if (layer && (maxResolution || maxResolution === 0)) {
      layer.setMaxResolution(maxResolution);
    }
  }, [maxResolution]);

  //properties
  useEffect(() => {
    if (layer && properties) {
      layer.setProperties(properties);
    }
  }, [properties]);

  //visible
  useEffect(() => {
    if (layer && visible !== undefined) {
      layer.setVisible(visible);
    }
  }, [visible]);
}
