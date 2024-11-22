// import { resolve } from "path";

export const imageToWebp = async (file: any) => {
  return new Promise<string | undefined>((resolve) => {
    let canvas = document.createElement("canvas");
    let img = document.createElement("img");
    // img.src = base64;
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      let webpImage = Promise.resolve(canvas.toDataURL("image/webp"));
      webpImage
        .then((webp) => {
          return resolve(webp);
        })
        .finally(() => {
          resolve(undefined);
        });
    };
  });
};
