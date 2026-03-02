"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.updateUser = updateUser;
exports.createUser = createUser;
exports.searchUsersPagination = searchUsersPagination;
const params_1 = require("./params");
const UserService = __importStar(require("../services/user.sevice"));
async function getUserById(req, res) {
    const { id } = req.params;
    const mensaje = await UserService.getUserById(Number(id));
    res.status(mensaje.code).json(mensaje);
}
async function getUserByEmail(req, res) {
    const { email } = req.params;
    const mensaje = await UserService.getUserByEmail((0, params_1.getParamString)(email));
    res.status(mensaje.code).json(mensaje);
}
async function updateUser(req, res) {
    const { email, name, id, password } = req.body;
    const mensaje = await UserService.updateUser(id, email, name, password);
    res.status(mensaje.code).json(mensaje);
}
async function createUser(req, res) {
    const { email, password, name, role } = req.body;
    const mensaje = await UserService.createUser(email, password, name, role);
    res.status(mensaje.code).json(mensaje);
}
async function searchUsersPagination(req, res) {
    const q = req.query;
    // Optional backward compatibility
    const p = req.params;
    const page = q.page ?? p.page;
    const size = q.size ?? p.size;
    const nombre = q.nombre;
    const email = q.email;
    const role = q.role;
    const sortField = q.sortField;
    const sortOrder = q.sortOrder;
    const mensaje = await UserService.searchUsersPagination(page, size, nombre, email, role ? parseInt(role) : -1, sortField, sortOrder);
    res.status(mensaje.code).json(mensaje);
}
