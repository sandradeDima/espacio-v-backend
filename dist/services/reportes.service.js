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
exports.getAllReportes = getAllReportes;
exports.getReporteById = getReporteById;
exports.getReportesByCliente = getReportesByCliente;
exports.createReporte = createReporte;
exports.updateReporte = updateReporte;
exports.deleteReporte = deleteReporte;
exports.getReportesByDateRange = getReportesByDateRange;
exports.createReporteCompleto = createReporteCompleto;
exports.generarDocumento = generarDocumento;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const ReportesRepo = __importStar(require("../repositories/reportes.repo"));
const ClientesRepo = __importStar(require("../repositories/clientes.repo"));
const ColoracionesRepo = __importStar(require("../repositories/coloraciones.repo"));
const FotosReportesRepo = __importStar(require("../repositories/fotosReportes.repo"));
const MensajeApi_1 = require("../types/MensajeApi");
async function getAllReportes() {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const reportes = await ReportesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reportes obtenidos correctamente';
        mensaje.data = reportes;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reportes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getReporteById(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const reporte = await ReportesRepo.findById(id);
        const fotos = await FotosReportesRepo.findByReporte(id);
        //extraer solo el nombre de la foto
        const fotoNames = fotos.map((foto) => foto.filename);
        if (!reporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reporte obtenido correctamente';
        mensaje.data = { reporte, fotoNames };
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getReportesByCliente(clienteId) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const reportes = await ReportesRepo.findByCliente(clienteId);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reportes del cliente obtenidos correctamente';
        mensaje.data = reportes;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reportes del cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function createReporte(clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        // Validate cliente exists
        const cliente = await ClientesRepo.findById(clienteId);
        if (!cliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        // Validate coloracion exists
        const coloracion = await ColoracionesRepo.findById(coloracionId);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        const reporte = await ReportesRepo.create(clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio);
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Reporte creado correctamente';
        mensaje.data = reporte;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function updateReporte(id, clienteId, coloracionId, formula, observaciones, precio) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        // Validate reporte exists
        const existingReporte = await ReportesRepo.findById(id);
        if (!existingReporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        // Validate cliente exists
        const cliente = await ClientesRepo.findById(clienteId);
        if (!cliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        // Validate coloracion exists
        const coloracion = await ColoracionesRepo.findById(coloracionId);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        const reporte = await ReportesRepo.update(id, clienteId, coloracion.id, formula, observaciones, precio);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reporte actualizado correctamente';
        mensaje.data = reporte;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function deleteReporte(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const deleted = await ReportesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reporte eliminado correctamente';
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getReportesByDateRange(startDate, endDate) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const reportes = await ReportesRepo.findByDateRange(startDate, endDate);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reportes obtenidos correctamente';
        mensaje.data = reportes;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reportes por rango de fechas';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function createReporteCompleto(clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio, fotos = []) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const cliente = await ClientesRepo.findById(clienteId);
        if (!cliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        const coloracion = await ColoracionesRepo.findById(coloracionId);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        const reporte = await ReportesRepo.create(clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio);
        const fotosGuardadas = [];
        for (const foto of fotos) {
            const fotoGuardada = await FotosReportesRepo.create(reporte.id, foto.filename);
            fotosGuardadas.push(fotoGuardada);
        }
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Reporte y fotos creados correctamente';
        mensaje.data = {
            reporte,
            fotos: fotosGuardadas
        };
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear reporte completo';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function generarDocumento(reportesIds, documentType) {
    const mensaje = new MensajeApi_1.MensajeApi();
    try {
        if (!Array.isArray(reportesIds) || reportesIds.length === 0) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'Debe proporcionar al menos un reporteId';
            return { ok: false, mensaje };
        }
        const reportes = [];
        for (const id of reportesIds) {
            const reporte = await ReportesRepo.findById(id);
            if (!reporte) {
                mensaje.code = 404;
                mensaje.error = true;
                mensaje.message = `Reporte con id ${id} no encontrado`;
                return { ok: false, mensaje };
            }
            const fotos = await FotosReportesRepo.findByReporte(id);
            reportes.push({ ...reporte, fotos });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        if (documentType === 'excel') {
            const csv = buildCsv(reportes);
            return {
                ok: true,
                buffer: Buffer.from(csv, 'utf-8'),
                filename: `reportes_${timestamp}.csv`,
                contentType: 'text/csv; charset=utf-8'
            };
        }
        if (documentType === 'pdf') {
            const buffer = await buildPdf(reportes);
            return {
                ok: true,
                buffer,
                filename: `reportes_${timestamp}.pdf`,
                contentType: 'application/pdf'
            };
        }
        mensaje.code = 400;
        mensaje.error = true;
        mensaje.message = 'Tipo de documento no soportado';
        return { ok: false, mensaje };
    }
    catch (error) {
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al generar documento';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return { ok: false, mensaje };
    }
}
function buildCsv(reportes) {
    const baseUrl = process.env.BASE_URL ?? '';
    const maxFotos = Math.max(0, ...reportes.map((r) => r.fotos.length));
    const fotoHeaders = Array.from({ length: maxFotos }, (_, idx) => `foto_${idx + 1}`);
    const header = [
        'id',
        'clienteNombre',
        'clienteEmail',
        'fechaServicio',
        'horaServicio',
        'servicio',
        'servicio_desc',
        'formula',
        'observaciones',
        'precio',
        ...fotoHeaders
    ];
    const escape = (value) => {
        const str = value === null || value === undefined ? '' : String(value);
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    const rows = reportes.map((r) => [
        r.id,
        r.clienteNombre ?? '',
        r.clienteEmail ?? '',
        formatDate(r.fechaServicio),
        r.horaServicio,
        r.coloracion ?? '',
        r.coloracion_desc ?? '',
        r.formula,
        r.observaciones,
        r.precio,
        ...Array.from({ length: maxFotos }, (_, idx) => {
            const foto = r.fotos[idx];
            return foto ? `${baseUrl || ''}/images/${foto.filename}` : '';
        })
    ]
        .map(escape)
        .join(','));
    return ['\ufeff' + header.join(','), ...rows].join('\n');
}
async function buildPdf(reportes) {
    const doc = new pdfkit_1.default({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const logoPath = path_1.default.resolve(process.cwd(), 'public', 'assets', 'logo espacio V-02.png');
    const gold = '#fcd34f';
    const black = '#000000';
    const gray = '#666666';
    // Header
    if (fs_1.default.existsSync(logoPath)) {
        doc.image(logoPath, doc.page.margins.left, doc.page.margins.top - 10, { fit: [140, 140], align: 'center' });
    }
    doc.fillColor(black).fontSize(22).text('Reporte de Servicios', { align: 'right' }).moveDown(0.5);
    doc.fillColor(gold).fontSize(12).text(new Date().toLocaleString(), { align: 'right' });
    doc.moveDown(1);
    for (const reporte of reportes) {
        doc.fillColor(gold).fontSize(14).text(`Reporte #${reporte.id}`, { underline: false });
        doc.moveDown(0.2);
        doc.fillColor(black).fontSize(12);
        doc.text(`Cliente: ${reporte.clienteNombre ?? 'N/D'} (${reporte.clienteEmail ?? 'sin email'})`);
        doc.text(`Fecha/Hora: ${formatDate(reporte.fechaServicio)} ${reporte.horaServicio}`);
        doc.text(`Coloración: ${reporte.coloracion ?? 'N/D'}${reporte.coloracion_desc ? ' - ' + reporte.coloracion_desc : ''}`);
        doc.text(`Precio: $${reporte.precio}`);
        doc.moveDown(0.2);
        doc.fillColor(gray).text('Observaciones:', { continued: false });
        doc.fillColor(black).text(reporte.observaciones || 'Sin observaciones');
        doc.moveDown(0.6);
        doc.fillColor(gold).text('FOTOGRAFÍAS', { underline: true });
        doc.moveDown(0.4);
        await renderImages(doc, reporte.fotos);
        doc.moveDown(1.2);
        // Divider
        doc.save();
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor(gold).stroke();
        doc.restore();
        doc.moveDown(1);
    }
    doc.end();
    return await new Promise((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
}
async function renderImages(doc, fotos) {
    if (fotos.length === 0) {
        doc.fillColor('#666666').font('Helvetica-Oblique').text('Sin fotos adjuntas');
        doc.font('Helvetica');
        return;
    }
    const maxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const gap = 10;
    const thumbWidth = Math.min(180, maxWidth);
    const perRow = Math.max(1, Math.floor((maxWidth + gap) / (thumbWidth + gap)));
    let x = doc.x;
    let y = doc.y;
    let col = 0;
    let maxRowBottom = y;
    for (const foto of fotos) {
        const imagePath = path_1.default.resolve(process.cwd(), 'uploads', 'images', foto.filename);
        if (!fs_1.default.existsSync(imagePath))
            continue;
        const availableHeight = doc.page.height - doc.page.margins.bottom - y;
        if (availableHeight < thumbWidth + gap) {
            doc.addPage();
            x = doc.x;
            y = doc.y;
            col = 0;
        }
        doc.image(imagePath, x, y, { width: thumbWidth, fit: [thumbWidth, thumbWidth] });
        maxRowBottom = Math.max(maxRowBottom, y + thumbWidth);
        col += 1;
        if (col >= perRow) {
            col = 0;
            x = doc.x;
            y = maxRowBottom + gap;
        }
        else {
            x += thumbWidth + gap;
        }
    }
    doc.y = maxRowBottom + gap;
}
function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}
