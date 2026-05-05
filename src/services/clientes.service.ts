import * as ClientesRepo from '../repositories/clientes.repo';
import { MensajeApi } from '../types/MensajeApi';

function normalizeOptionalEmail(email?: string | null): string | null {
    if (email == null) return null;
    const normalized = email.trim();
    return normalized.length > 0 ? normalized : null;
}

function normalizeOptionalComentarios(comentarios?: string | null): string | null {
    if (comentarios == null) return null;
    const normalized = comentarios.trim();
    return normalized.length > 0 ? normalized : null;
}

export async function getAllClientes(): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const clientes = await ClientesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Clientes obtenidos correctamente';
        mensaje.data = clientes;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener clientes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getClienteById(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
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
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function createCliente(
    nombre: string,
    email?: string | null,
    telefono?: string,
    comentarios?: string | null
): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const normalizedEmail = normalizeOptionalEmail(email);
        const normalizedTelefono = (telefono ?? '').trim();
        const normalizedComentarios = normalizeOptionalComentarios(comentarios);
        
        if (normalizedEmail) {
            const existingCliente = await ClientesRepo.findByEmail(normalizedEmail);
            if (existingCliente) {
                mensaje.code = 400;
                mensaje.error = true;
                mensaje.message = 'Ya existe un cliente con ese email';
                return mensaje;
            }
        }
        
        const cliente = await ClientesRepo.create(
            nombre,
            normalizedEmail,
            normalizedTelefono,
            normalizedComentarios
        );
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Cliente creado correctamente';
        mensaje.data = cliente;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function updateCliente(
    id: number,
    nombre: string,
    email?: string | null,
    telefono?: string,
    comentarios?: string | null
): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const normalizedEmail = normalizeOptionalEmail(email);
        const normalizedTelefono = (telefono ?? '').trim();
        const normalizedComentarios = normalizeOptionalComentarios(comentarios);
        
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
        
        const cliente = await ClientesRepo.update(
            id,
            nombre,
            normalizedEmail,
            normalizedTelefono,
            normalizedComentarios
        );

        
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Cliente actualizado correctamente';
        mensaje.data = cliente;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function deleteCliente(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
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
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function searchClientes(query: string): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const clientes = await ClientesRepo.search(query);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Búsqueda realizada correctamente';
        mensaje.data = clientes;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al buscar clientes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function searchClientesPagination(page: string, size: string, clientName?: string, clientEmail?: string, clientPhone?: string, sortField?: string, sortOrder?: string): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeSize = Math.max(1, parseInt(size, 10) || 10);

        const { clientes, total } = await ClientesRepo.searchPagination(
            safePage,
            safeSize,
            clientName,
            clientEmail,
            clientPhone,
            sortField,
            sortOrder
        );

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
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al buscar clientes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
