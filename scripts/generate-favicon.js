const fs = require("fs");
const path = require("path");

const WIDTH = 32;
const HEIGHT = 32;

// Create 32x32 RGBA buffer
const pixels = Array.from({ length: HEIGHT }, () =>
  Array.from({ length: WIDTH }, () => ({ r: 0, g: 0, b: 0, a: 0 }))
);

function setPixel(x, y, r, g, b, a = 255) {
  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
    pixels[y][x] = { r, g, b, a };
  }
}

function fillRect(x1, y1, w, h, r, g, b, a = 255) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(x1 + dx, y1 + dy, r, g, b, a);
    }
  }
}

// Coordinate system: y=0 is bottom, y=31 is top

// 1. Platter / Base stand
// Base foot
fillRect(11, 1, 10, 2, 253, 164, 175); // #FDA4AF
// Plate rim
fillRect(4, 3, 24, 2, 244, 63, 94);   // #F43F5E
fillRect(5, 4, 22, 1, 253, 164, 175); // #FDA4AF

// 2. Cake Body (y = 5 to 16, x = 6 to 25)
fillRect(6, 5, 20, 11, 252, 231, 243); // #FCE7F3 cake sponge

// Cream filling stripes (y = 9 to 10)
fillRect(6, 9, 20, 2, 251, 113, 133); // #FB7185

// Decorative Sprinkles
setPixel(9, 7, 219, 39, 119);   // #DB2777
setPixel(13, 6, 245, 158, 11);  // #F59E0B
setPixel(18, 7, 219, 39, 119);
setPixel(22, 6, 255, 255, 255);
setPixel(10, 12, 245, 158, 11);
setPixel(15, 12, 219, 39, 119);
setPixel(20, 12, 255, 255, 255);

// 3. Frosting Top & Drips (y = 15 to 19)
fillRect(5, 16, 22, 3, 244, 63, 94); // #F43F5E
fillRect(6, 19, 20, 1, 244, 63, 94);
// Frosting Drips
setPixel(7, 14, 244, 63, 94);
setPixel(7, 15, 244, 63, 94);
setPixel(11, 13, 244, 63, 94);
setPixel(11, 14, 244, 63, 94);
setPixel(11, 15, 244, 63, 94);
setPixel(16, 14, 244, 63, 94);
setPixel(16, 15, 244, 63, 94);
setPixel(20, 13, 244, 63, 94);
setPixel(20, 14, 244, 63, 94);
setPixel(20, 15, 244, 63, 94);
setPixel(24, 15, 244, 63, 94);

// Top dollops of cream
fillRect(7, 20, 3, 1, 255, 255, 255);
fillRect(14, 20, 4, 1, 255, 255, 255);
fillRect(21, 20, 3, 1, 255, 255, 255);

// 4. Candle (y = 20 to 26, center at x = 14..17)
fillRect(14, 20, 4, 7, 244, 114, 182); // #F472B6
// Candle stripes
setPixel(14, 22, 190, 24, 93);
setPixel(15, 23, 190, 24, 93);
setPixel(16, 24, 190, 24, 93);
setPixel(17, 25, 190, 24, 93);

// 5. Candle Flame (y = 27 to 31)
// Outer flame
setPixel(15, 27, 245, 158, 11); // #F59E0B
setPixel(16, 27, 245, 158, 11);
fillRect(14, 28, 4, 2, 245, 158, 11);
setPixel(15, 30, 245, 158, 11);
setPixel(16, 30, 245, 158, 11);
setPixel(15, 31, 245, 158, 11);
// Inner hot core
fillRect(15, 28, 2, 2, 254, 240, 138); // #FEF08A

// Build ICO file
const headerSize = 6;
const dirSize = 16;
const bmiHeaderSize = 40;
const pixelDataSize = WIDTH * HEIGHT * 4;
const maskRowSize = Math.ceil(WIDTH / 32) * 4; // 4 bytes per row
const maskSize = maskRowSize * HEIGHT; // 128 bytes
const imageResSize = bmiHeaderSize + pixelDataSize + maskSize;
const totalFileSize = headerSize + dirSize + imageResSize;

const buffer = Buffer.alloc(totalFileSize);
let offset = 0;

// 1. ICONDIR
buffer.writeUInt16LE(0, offset); offset += 2; // Reserved
buffer.writeUInt16LE(1, offset); offset += 2; // Type 1 = ICO
buffer.writeUInt16LE(1, offset); offset += 2; // 1 image

// 2. ICONDIRENTRY
buffer.writeUInt8(WIDTH, offset++); // Width
buffer.writeUInt8(HEIGHT, offset++); // Height
buffer.writeUInt8(0, offset++); // Color palette count (0 for 24/32bpp)
buffer.writeUInt8(0, offset++); // Reserved
buffer.writeUInt16LE(1, offset); offset += 2; // Color planes
buffer.writeUInt16LE(32, offset); offset += 2; // Bits per pixel
buffer.writeUInt32LE(imageResSize, offset); offset += 4; // Resource size
buffer.writeUInt32LE(headerSize + dirSize, offset); offset += 4; // Offset to image data

// 3. BITMAPINFOHEADER
buffer.writeUInt32LE(bmiHeaderSize, offset); offset += 4; // biSize
buffer.writeInt32LE(WIDTH, offset); offset += 4; // biWidth
buffer.writeInt32LE(HEIGHT * 2, offset); offset += 4; // biHeight (double for mask)
buffer.writeUInt16LE(1, offset); offset += 2; // biPlanes
buffer.writeUInt16LE(32, offset); offset += 2; // biBitCount
buffer.writeUInt32LE(0, offset); offset += 4; // biCompression (BI_RGB)
buffer.writeUInt32LE(pixelDataSize, offset); offset += 4; // biSizeImage
buffer.writeInt32LE(0, offset); offset += 4; // biXPelsPerMeter
buffer.writeInt32LE(0, offset); offset += 4; // biYPelsPerMeter
buffer.writeUInt32LE(0, offset); offset += 4; // biClrUsed
buffer.writeUInt32LE(0, offset); offset += 4; // biClrImportant

// 4. Pixel data (BGRA, bottom-up)
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const p = pixels[y][x];
    buffer.writeUInt8(p.b, offset++); // Blue
    buffer.writeUInt8(p.g, offset++); // Green
    buffer.writeUInt8(p.r, offset++); // Red
    buffer.writeUInt8(p.a, offset++); // Alpha
  }
}

// 5. AND mask (1 bit per pixel: 0 for opaque, 1 for transparent)
for (let y = 0; y < HEIGHT; y++) {
  let maskRow = 0;
  for (let x = 0; x < WIDTH; x++) {
    if (pixels[y][x].a === 0) {
      maskRow |= (1 << (31 - x));
    }
  }
  buffer.writeUInt32BE(maskRow >>> 0, offset);
  offset += 4;
}

// Write to app/favicon.ico and public/favicon.ico
const appIcoPath = path.resolve(__dirname, "../app/favicon.ico");
const pubIcoPath = path.resolve(__dirname, "../public/favicon.ico");

fs.writeFileSync(appIcoPath, buffer);
fs.writeFileSync(pubIcoPath, buffer);
console.log(`Generated cake favicon.ico (${buffer.length} bytes) successfully!`);
