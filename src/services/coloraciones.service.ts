import * as ColoracionesRepo from '../repositories/coloraciones.repo';
import { MensajeApi } from '../types/MensajeApi';

function normalizeOptionalPrecio(precio?: number | string | null): number | null {
    if (precio == null || precio === '') return null;
    const parsed = typeof precio === 'number' ? precio : Number(precio);
    return Number.isFinite(parsed) ? parsed : null;
}

export async function getAllColoraciones(): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const coloraciones = await ColoracionesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloraciones obtenidas correctamente';
        mensaje.data = coloraciones;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener coloraciones';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getColoracionById(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const coloracion = await ColoracionesRepo.findById(id);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloración obtenida correctamente';
        mensaje.data = coloracion;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function createColoracion(
    nombre: string,
    descripcion: string,
    precio?: number | string | null
): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const coloracion = await ColoracionesRepo.create(
            nombre,
            descripcion,
            normalizeOptionalPrecio(precio)
        );
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Coloración creada correctamente';
        mensaje.data = coloracion;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function updateColoracion(
    id: number,
    nombre: string,
    descripcion: string,
    precio?: number | string | null
): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const coloracion = await ColoracionesRepo.update(
            id,
            nombre,
            descripcion,
            normalizeOptionalPrecio(precio)
        );
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloración actualizada correctamente';
        mensaje.data = coloracion;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function deleteColoracion(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const deleted = await ColoracionesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloración eliminada correctamente';
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function searchColoraciones(query: string): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        console.log(query);
        const coloraciones = await ColoracionesRepo.search(query);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Búsqueda realizada correctamente';
        mensaje.data = coloraciones;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al buscar coloraciones';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
