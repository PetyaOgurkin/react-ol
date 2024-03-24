export async function imgToArray(src: string): Promise<{ data: Float32Array; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvasPic = document.createElement("canvas");
      const ctxPic = canvasPic.getContext("2d")!;
      canvasPic.width = img.width;
      canvasPic.height = img.height;
      ctxPic.drawImage(img, 0, 0);

      const imageData = ctxPic.getImageData(0, 0, img.width, img.height).data;

      canvasPic.style.display = "none";

      const data = new Float32Array(imageData.length / 4);
      for (let i = 0; i < imageData.length; i += 4) {
        data[i / 4] = (imageData[i] * 200) / 255 - 100;
      }

      return resolve({ data, width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = src;
    img.crossOrigin = "anonymous";
  });
}
