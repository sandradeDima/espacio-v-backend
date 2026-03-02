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
exports.getAllClientes = getAllClientes;
exports.getClienteById = getClienteById;
exports.createCliente = createCliente;
exports.updateCliente = updateCliente;
exports.deleteCliente = deleteCliente;
exports.searchClientes = searchClientes;
exports.searchClientesPagination = searchClientesPagination;
const ClientesRepo = __importStar(require("../repositories/clientes.repo"));
const MensajeApi_1 = require("../types/MensajeApi");
function normalizeOptionalEmail(email) {
    if (email == null)
        return null;
    const normalized = email.trim();
    return normalized.length > 0 ? normalized : null;
}
async function getAllClientes() {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const clientes = await ClientesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Clientes obtenidos correctamente';
        mensaje.data = clientes;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener clientes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getClienteById(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const cliente = await ClientesRepo.findById(id);
        if (!cliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Cliente obtenido correctamente';
        mensaje.data = cliente;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function createCliente(nombre, email, telefono) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const normalizedEmail = normalizeOptionalEmail(email);
        const normalizedTelefono = (telefono ?? '').trim();
        if (normalizedEmail) {
            const existingCliente = await ClientesRepo.findByEmail(normalizedEmail);
            if (existingCliente) {
                mensaje.code = 400;
                mensaje.error = true;
                mensaje.message = 'Ya existe un cliente con ese email';
                return mensaje;
            }
        }
        const cliente = await ClientesRepo.create(nombre, normalizedEmail, normalizedTelefono);
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Cliente creado correctamente';
        mensaje.data = cliente;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function updateCliente(id, nombre, email, telefono) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const normalizedEmail = normalizeOptionalEmail(email);
        const normalizedTelefono = (telefono ?? '').trim();
        // Check if cliente exists
        const existingCliente = await ClientesRepo.findById(id);
        if (!existingCliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        // Check if email is being changed and if it's already taken
        if (normalizedEmail && normalizedEmail !== existingCliente.email) {
            const emailTaken = await ClientesRepo.findByEmail(normalizedEmail);
            if (emailTaken) {
                mensaje.code = 400;
                mensaje.error = true;
                mensaje.message = 'Ya existe un cliente con ese email';
                return mensaje;
            }
        }
        const cliente = await ClientesRepo.update(id, nombre, normalizedEmail, normalizedTelefono);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Cliente actualizado correctamente';
        mensaje.data = cliente;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function deleteCliente(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const deleted = await ClientesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Cliente eliminado correctamente';
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function searchClientes(query) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const clientes = await ClientesRepo.search(query);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Búsqueda realizada correctamente';
        mensaje.data = clientes;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al buscar clientes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function searchClientesPagination(page, size, clientName, clientEmail, clientPhone, sortField, sortOrder) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeSize = Math.max(1, parseInt(size, 10) || 10);
        const { clientes, total } = await ClientesRepo.searchPagination(safePage, safeSize, clientName, clientEmail, clientPhone, sortField, sortOrder);
        const pages = total === 0 ? 0 : Math.ceil(total / safeSize);
        if (total > 0 && safePage > pages) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Pagina no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Búsqueda realizada correctamente';
        mensaje.data = { clientes, total, pages };
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al buscar clientes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
