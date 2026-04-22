import fs from 'fs';
import path from 'path';
import * as FotosReportesRepo from '../repositories/fotosReportes.repo';
import * as ReportesRepo from '../repositories/reportes.repo';
import { MensajeApi } from '../types/MensajeApi';

function removePhotoFile(filename: string) {
    const imagePath = path.resolve(process.cwd(), 'uploads', 'images', filename);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

export async function getAllFotosReportes(): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const fotos = await FotosReportesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Fotos obtenidas correctamente';
        mensaje.data = fotos;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener fotos';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getFotoReporteById(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const foto = await FotosReportesRepo.findById(id);
        if (!foto) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Foto obtenida correctamente';
        mensaje.data = foto;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getFotosByReporte(reporteId: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const fotos = await FotosReportesRepo.findByReporte(reporteId);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Fotos del reporte obtenidas correctamente';
        mensaje.data = fotos;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener fotos del reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function createFotoReporte(reporteId: number, filename: string): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        
        // Validate reporte exists
        const reporte = await ReportesRepo.findById(reporteId);
        if (!reporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        
        const foto = await FotosReportesRepo.create(reporteId, filename);
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Foto creada correctamente';
        mensaje.data = foto;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function updateFotoReporte(id: number, reporteId: number, filename: string): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        
        // Validate foto exists
        const existingFoto = await FotosReportesRepo.findById(id);
        if (!existingFoto) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        
        // Validate reporte exists
        const reporte = await ReportesRepo.findById(reporteId);
        if (!reporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        
        const foto = await FotosReportesRepo.update(id, reporteId, filename);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Foto actualizada correctamente';
        mensaje.data = foto;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function deleteFotoReporte(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const foto = await FotosReportesRepo.findById(id);
        if (!foto) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        const deleted = await FotosReportesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        try {
            removePhotoFile(foto.filename);
        } catch {
            // Ignore filesystem cleanup issues after DB delete succeeds.
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Foto eliminada correctamente';
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function deleteFotosByReporte(reporteId: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const fotos = await FotosReportesRepo.findByReporte(reporteId);
        const deletedCount = await FotosReportesRepo.removeByReporte(reporteId);
        for (const foto of fotos) {
            try {
                removePhotoFile(foto.filename);
            } catch {
                // Ignore filesystem cleanup issues after DB delete succeeds.
            }
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = `${deletedCount} foto(s) eliminada(s) correctamente`;
        mensaje.data = { deletedCount };
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar fotos del reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
