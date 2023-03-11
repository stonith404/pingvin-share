import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as sharp from "sharp";

const IMAGES_PATH = "../frontend/public/img";

@Injectable()
export class LogoService {
  async create(file: Buffer) {
    fs.writeFileSync(`${IMAGES_PATH}/logo.png`, file, "binary");
    this.createFavicon(file);
    this.createPWAIcons(file);
  }

  async createFavicon(file: Buffer) {
    const resized = await sharp(file).resize(16).toBuffer();
    fs.promises.writeFile(`${IMAGES_PATH}/favicon.ico`, resized, "binary");
  }

  async createPWAIcons(file: Buffer) {
    const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];

    for (const size of sizes) {
      const resized = await sharp(file).resize(size).toBuffer();
      fs.promises.writeFile(
        `${IMAGES_PATH}/icons/icon-${size}x${size}.png`,
        resized,
        "binary"
      );
    }
  }
}
