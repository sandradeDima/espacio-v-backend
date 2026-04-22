import { Request, Response } from 'express';
import { getParamInt } from './params';
import type { Express } from 'express';
import * as ReportesService from '../services/reportes.service';
import { logger } from '../config/logger';

export async function getAllReportes(req: Request, res: Response) {
    const mensaje = await ReportesService.getAllReportes();
    res.status(mensaje.code).json(mensaje);
}

export async function getReporteById(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await ReportesService.getReporteById(id);
    res.status(mensaje.code).json(mensaje);
}

export async function getReportesByCliente(req: Request, res: Response) {
    const clienteId = getParamInt(req.params.clienteId);
    const mensaje = await ReportesService.getReportesByCliente(clienteId);
    res.status(mensaje.code).json(mensaje);
}

export async function createReporte(req: Request, res: Response) {
    const { clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio } = req.body;
    logger.info("horaServicio",horaServicio);
    logger.info("fechaServicio",fechaServicio);
    const mensaje = await ReportesService.createReporte(
        clienteId,
        fechaServicio,
        horaServicio,
        coloracionId,
        formula,
        observaciones,
        precio
    );
    res.status(mensaje.code).json(mensaje);
}

export async function updateReporte(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const { clienteId, coloracion, fechaServicio, horaServicio, formula, observaciones, precio } = req.body;
    const mensaje = await ReportesService.updateReporte(
        id,
        clienteId,
        coloracion,
        fechaServicio,
        horaServicio,
        formula,
        observaciones,
        precio
    );
    res.status(mensaje.code).json(mensaje);
}

export async function deleteReporte(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await ReportesService.deleteReporte(id);
    res.status(mensaje.code).json(mensaje);
}

export async function getReportesByDateRange(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const mensaje = await ReportesService.getReportesByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
    );
    res.status(mensaje.code).json(mensaje);
}

export async function createReporteCompleto(req: Request, res: Response) {
    const { clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio } = req.body;
    const fotos = (req.files as Express.Multer.File[] | undefined) ?? [];

    const mensaje = await ReportesService.createReporteCompleto(
        Number(clienteId),
        fechaServicio,
        horaServicio,
        Number(coloracionId),
        formula,
        observaciones ?? 'Sin observaciones',
        Number(precio),
        fotos
    );
    res.status(mensaje.code).json(mensaje);
}

export async function addFotosToReporte(req: Request, res: Response) {
    const reporteId = getParamInt(req.params.id);
    const fotos = (req.files as Express.Multer.File[] | undefined) ?? [];
    const mensaje = await ReportesService.addFotosToReporte(reporteId, fotos);
    res.status(mensaje.code).json(mensaje);
}

export async function generarDocumento(req:Request,res:Response) {
    const {reportesIds,documentType} = req.body;
    const resultado = await ReportesService.generarDocumento(reportesIds,documentType);

    if (!resultado.ok) {
        res.status(resultado.mensaje.code).json(resultado.mensaje);
        return;
    }

    res.setHeader('Content-Type', resultado.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${resultado.filename}"`);
    res.send(resultado.buffer);
}
