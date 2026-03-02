import { Request, Response } from 'express';
import { getParamInt } from './params';
import * as FotosReportesService from '../services/fotosReportes.service';

export async function getAllFotosReportes(req: Request, res: Response) {
    const mensaje = await FotosReportesService.getAllFotosReportes();
    res.status(mensaje.code).json(mensaje);
}

export async function getFotoReporteById(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await FotosReportesService.getFotoReporteById(id);
    res.status(mensaje.code).json(mensaje);
}

export async function getFotosByReporte(req: Request, res: Response) {
    const reporteId = getParamInt(req.params.reporteId);
    const mensaje = await FotosReportesService.getFotosByReporte(reporteId);
    res.status(mensaje.code).json(mensaje);
}

export async function createFotoReporte(req: Request, res: Response) {
    const { reporteId, filename } = req.body;
    const mensaje = await FotosReportesService.createFotoReporte(reporteId, filename);
    res.status(mensaje.code).json(mensaje);
}

export async function updateFotoReporte(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const { reporteId, filename } = req.body;
    const mensaje = await FotosReportesService.updateFotoReporte(id, reporteId, filename);
    res.status(mensaje.code).json(mensaje);
}

export async function deleteFotoReporte(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await FotosReportesService.deleteFotoReporte(id);
    res.status(mensaje.code).json(mensaje);
}

export async function deleteFotosByReporte(req: Request, res: Response) {
    const reporteId = getParamInt(req.params.reporteId);
    const mensaje = await FotosReportesService.deleteFotosByReporte(reporteId);
    res.status(mensaje.code).json(mensaje);
}

