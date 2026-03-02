"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const imagesDir = path_1.default.resolve(process.cwd(), 'uploads', 'images');
// Ensure destination exists at startup
if (!fs_1.default.existsSync(imagesDir)) {
    fs_1.default.mkdirSync(imagesDir, { recursive: true });
}
const generateCuid = () => 'c' + crypto_1.default.randomBytes(16).toString('hex');
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, imagesDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname) ||
            (file.mimetype.includes('/') ? `.${file.mimetype.split('/')[1]}` : '');
        cb(null, `${generateCuid()}${ext}`);
    }
});
exports.uploadImages = (0, multer_1.default)({ storage });
