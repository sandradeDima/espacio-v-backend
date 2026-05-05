import { Request, Response } from 'express';
import { getParamInt } from './params';
import * as ColoracionesService from '../services/coloraciones.service';
import { logger } from '../config/logger';

export async function getAllColoraciones(req: Request, res: Response) {
    const mensaje = await ColoracionesService.getAllColoraciones();
    res.status(mensaje.code).json(mensaje);
}

export async function getColoracionById(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await ColoracionesService.getColoracionById(id);
    res.status(mensaje.code).json(mensaje);
}

export async function createColoracion(req: Request, res: Response) {
    const { nombre, descripcion, precio } = req.body;
    const mensaje = await ColoracionesService.createColoracion(nombre, descripcion, precio);
    res.status(mensaje.code).json(mensaje);
}

export async function updateColoracion(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const { nombre, descripcion, precio } = req.body;
    const mensaje = await ColoracionesService.updateColoracion(id, nombre, descripcion, precio);
    res.status(mensaje.code).json(mensaje);
}

export async function deleteColoracion(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await ColoracionesService.deleteColoracion(id);
    res.status(mensaje.code).json(mensaje);
}

export async function searchColoraciones(req: Request, res: Response) {
    logger.info("llega a searchColoraciones")
    const query = req.query.query as string || '';
    logger.info(query)
    const mensaje = await ColoracionesService.searchColoraciones(query);
    res.status(mensaje.code).json(mensaje);
}
