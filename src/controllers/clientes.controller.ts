import { Request, Response } from 'express';
import { getParamInt } from './params';
import * as ClientesService from '../services/clientes.service';

export async function getAllClientes(req: Request, res: Response) {
    const mensaje = await ClientesService.getAllClientes();
    res.status(mensaje.code).json(mensaje);
}

export async function getClienteById(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await ClientesService.getClienteById(id);
    res.status(mensaje.code).json(mensaje);
}

export async function createCliente(req: Request, res: Response) {
    const { nombre, email, telefono, comentarios } = req.body;
    const mensaje = await ClientesService.createCliente(nombre, email, telefono, comentarios);
    res.status(mensaje.code).json(mensaje);
}

export async function updateCliente(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const { nombre, email, telefono, comentarios } = req.body;
    const mensaje = await ClientesService.updateCliente(id, nombre, email, telefono, comentarios);
    res.status(mensaje.code).json(mensaje);
}

export async function deleteCliente(req: Request, res: Response) {
    const id = getParamInt(req.params.id);
    const mensaje = await ClientesService.deleteCliente(id);
    res.status(mensaje.code).json(mensaje);
}

export async function searchClientes(req: Request, res: Response) {
    const query = req.query.q as string || '';
    const mensaje = await ClientesService.searchClientes(query);
    res.status(mensaje.code).json(mensaje);
}

export async function searchClientesPagination(req: Request, res: Response) {
  const q = req.query as Record<string, string | undefined>;
  // Optional backward compatibility
  const p = req.params as Record<string, string | undefined>;

  const page = q.page ?? p.page;
  const size = q.size ?? p.size;

  const nombre = q.nombre;
  const email = q.email;
  const telefono = q.telefono;

  const sortField = q.sortField;
  const sortOrder = q.sortOrder;

  const mensaje = await ClientesService.searchClientesPagination(
    page as string,
    size as string,
    nombre,
    email,
    telefono,
    sortField,
    sortOrder
  );
  res.status(mensaje.code).json(mensaje);
}
