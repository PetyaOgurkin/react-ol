import { useEffect } from "react";
import { WMSLayerBasePropsType } from "../types";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import TileWMS from "ol/source/TileWMS";
import TileLayer from "ol/layer/Tile";
import WebGLTileLayer from "ol/layer/WebGLTile";

export function useWMSLayerBasePropsRefresh(
  layer: ImageLayer<ImageWMS> | TileLayer<TileWMS> | WebGLTileLayer | undefined,
  props: WMSLayerBasePropsType
) {
  // url
  useEffect(() => {
    if (layer && props.url) {
      const source = layer.getSource() as TileWMS | ImageWMS;
      if (source) {
        if ((source as ImageWMS).getUrl && (source as ImageWMS).getUrl() !== props.url) {
          source.setUrl(props.url);
          source.refresh();
        } else if (!!(source as TileWMS).getUrls) {
          const urls = (source as TileWMS).getUrls();
          if (urls && urls[0] !== props.url) {
            source.setUrl(props.url);
            source.refresh();
          }
        }
      }
    }
  }, [props.url]);

  // params
  useEffect(() => {
    if (layer && props.params) {
      const source = layer.getSource() as TileWMS | ImageWMS;
      if (source && source.getParams() !== props.params) {
        source.updateParams(props.params);
      }
    }
  }, [props.params]);
}
