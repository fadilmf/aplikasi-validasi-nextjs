import Jimp from "jimp";

export default async function watermark(
  buffer: Buffer,
  { sn, datetime, location }: { sn: number; datetime: string; location: string }
) {
  // Buat gambar latar belakang untuk teks watermark
  const imageBefore = await Jimp.read(buffer);
  const imageResized = imageBefore.cover(500, 500);

  const imageWidth = imageResized.getWidth();
  const imageHeight = imageResized.getHeight();

  console.log(imageWidth);
  console.log(imageHeight);

  const textWidth = 500; // Lebar latar belakang teks
  const textHeight = 500; // Tinggi latar belakang teks
  const backgroundColor = 0x000000ff; // Warna latar belakang (hitam)

  const backgroundWatermark = new Jimp(textWidth, textHeight, backgroundColor);

  // Tambahkan teks pada latar belakang
  //   const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const font = await Jimp.loadFont(
    "src/fonts/open-sans-32-white/open-sans-32-white.fnt"
  );
  backgroundWatermark.print(
    font,
    10,
    100,
    {
      text:
        "Serial Number : " +
        sn +
        ", Tanggal : " +
        datetime +
        ", Lokasi : " +
        location,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    },
    450,
    200
  );

  // Gabungkan latar belakang teks dengan gambar asli
  const x = 0; // Posisi x untuk teks pada gambar asli
  const y = 0; // Posisi y untuk teks pada gambar asli

  imageResized.composite(backgroundWatermark, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER, // Atur mode blending untuk transparansi
    opacitySource: 0.2, // Ubah kecerahan teks agar tidak terlalu terang
  });

  return await imageResized.getBase64Async(Jimp.MIME_JPEG);
}
