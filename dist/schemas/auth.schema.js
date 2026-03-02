"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAllSchema = exports.logoutSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1).optional()
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
    userId: zod_1.z.number()
});
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
    userId: zod_1.z.number()
});
exports.logoutAllSchema = zod_1.z.object({
    userId: zod_1.z.number()
});
