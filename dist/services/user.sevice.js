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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.updateUser = updateUser;
exports.createUser = createUser;
exports.searchUsersPagination = searchUsersPagination;
const MensajeApi_1 = require("../types/MensajeApi");
const UserRepo = __importStar(require("../repositories/user.repo"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../config/logger");
async function getUserById(id) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        //get user by id
        const user = await UserRepo.findById(id);
        if (!user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = "Usuario no encontrado";
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = "Usuario encontrado";
        mensaje.data = user;
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = "Error al obtener el usuario";
        mensaje.technicalMessage =
            error instanceof Error ? error.message : "Error desconocido";
        return mensaje;
    }
}
async function getUserByEmail(email) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        //get user by email
        const user = await UserRepo.findByEmail(email);
        if (!user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = "Usuario no encontrado";
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = "Usuario encontrado";
        mensaje.data = user;
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = "Error al obtener el usuario";
        mensaje.technicalMessage =
            error instanceof Error ? error.message : "Error desconocido";
        return mensaje;
    }
}
async function updateUser(id, email, name, password) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        //update user
        const user = await UserRepo.findById(id);
        if (!user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = "Usuario no encontrado";
            return mensaje;
        }
        user.email = email;
        user.name = name;
        user.updatedAt = new Date();
        await UserRepo.updateUser(id, user.email, user.name, user.updatedAt);
        if (password) {
            let passwordHash = await bcryptjs_1.default.hash(password, 10);
            await UserRepo.updatePassword(passwordHash, id);
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = "Usuario actualizado correctamente";
        mensaje.data = user;
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = "Error al actualizar el usuario";
        mensaje.technicalMessage =
            error instanceof Error ? error.message : "Error desconocido";
        return mensaje;
    }
}
async function createUser(email, password, name, roleId) {
    let mensaje = new MensajeApi_1.MensajeApi();
    try {
        const user = await UserRepo.findByEmail(email);
        logger_1.logger.info("este es el usuario:");
        logger_1.logger.info(user);
        if (user && user != null && user != undefined) {
            logger_1.logger.info("el usuario existe");
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = "Usuario con ese email ya existe";
            return mensaje;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await UserRepo.createUser(email, hashedPassword, name, roleId);
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = "Usuario creado correctamente";
        return mensaje;
    }
    catch (error) {
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = "Error al crear el usuario";
        mensaje.technicalMessage =
            error instanceof Error ? error.message : "Error desconocido";
        return mensaje;
    }
}
async function searchUsersPagination(page, size, name, email, role, sortField, sortOrder) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const users = await UserRepo.searchPagination(parseInt(page), parseInt(size), name, email, role, sortField, sortOrder);
        const total = users.length;
        const pages = Math.ceil(total / parseInt(size));
        if (parseInt(page) < 1 || parseInt(page) > pages) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = "Pagina no encontrada";
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = "Búsqueda realizada correctamente";
        mensaje.data = { users, total, page };
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = "Error al buscar usuarios";
        mensaje.technicalMessage =
            error instanceof Error ? error.message : "Error desconocido";
        return mensaje;
    }
}
