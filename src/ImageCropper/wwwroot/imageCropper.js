const imageCache = new WeakMap();

function getCropSize(width, height, aspectRatio, lockAspectRatio) {
  if (!lockAspectRatio || !aspectRatio || aspectRatio <= 0) {
    return { width: Math.floor(width * 0.9), height: Math.floor(height * 0.9) };
  }

  let cropWidth = width * 0.9;
  let cropHeight = cropWidth / aspectRatio;

  if (cropHeight > height * 0.9) {
    cropHeight = height * 0.9;
    cropWidth = cropHeight * aspectRatio;
  }

  return { width: Math.floor(cropWidth), height: Math.floor(cropHeight) };
}

async function loadImage(url) {
  if (!url) {
    return null;
  }

  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

export async function render(canvas, imageUrl, zoom, rotation, aspectRatio, lockAspectRatio) {
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!imageUrl) {
    return;
  }

  const current = imageCache.get(canvas);
  let image = current?.image;

  if (!current || current.url !== imageUrl) {
    image = await loadImage(imageUrl);
    imageCache.set(canvas, { url: imageUrl, image });
  }

  if (!image) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const radians = (rotation * Math.PI) / 180;
  const baseScale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const scale = baseScale * Math.max(zoom, 1);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;

  context.save();
  context.translate(canvasWidth / 2, canvasHeight / 2);
  context.rotate(radians);
  context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  context.restore();

  const crop = getCropSize(canvasWidth, canvasHeight, aspectRatio, lockAspectRatio);
  const cropX = (canvasWidth - crop.width) / 2;
  const cropY = (canvasHeight - crop.height) / 2;

  context.strokeStyle = "#0a7ea4";
  context.lineWidth = 2;
  context.strokeRect(cropX, cropY, crop.width, crop.height);
}

export async function exportBlob(canvas, mimeType, quality, aspectRatio, lockAspectRatio) {
  const crop = getCropSize(canvas.width, canvas.height, aspectRatio, lockAspectRatio);
  const cropX = (canvas.width - crop.width) / 2;
  const cropY = (canvas.height - crop.height) / 2;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = crop.width;
  outputCanvas.height = crop.height;

  const outputContext = outputCanvas.getContext("2d");
  outputContext.drawImage(
    canvas,
    cropX,
    cropY,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  const blob = await new Promise((resolve) => outputCanvas.toBlob(resolve, mimeType, quality));
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });

  return {
    base64: btoa(binary),
    mimeType: blob.type,
    blobUrl: URL.createObjectURL(blob),
    width: crop.width,
    height: crop.height,
    size: blob.size
  };
}
