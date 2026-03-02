import { Request, Response } from 'express';
import { getParamString } from './params';
import * as UserService from '../services/user.sevice';

export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const mensaje = await UserService.getUserById(Number(id));
    res.status(mensaje.code).json(mensaje);
}

export async function getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const mensaje = await UserService.getUserByEmail(getParamString(email));
    res.status(mensaje.code).json(mensaje);
}


export async function updateUser(req: Request, res: Response) {
    const {email, name, id, password} = req.body;
    const mensaje = await UserService.updateUser(id,email!, name!, password);
    res.status(mensaje.code).json(mensaje);
}

export async function createUser(req: Request, res: Response) {
    const {email, password, name, role} = req.body;
    const mensaje = await UserService.createUser(email!, password!, name!, role!);
    res.status(mensaje.code).json(mensaje);
}

export async function searchUsersPagination(req: Request, res: Response) {
    const q = req.query as Record<string, string | undefined>;
    // Optional backward compatibility
    const p = req.params as Record<string, string | undefined>;

    const page = q.page ?? p.page;
    const size = q.size ?? p.size;
    

    const nombre = q.nombre;
    const email = q.email;
    const role = q.role;
    
    const sortField = q.sortField;
    const sortOrder = q.sortOrder;    
    const mensaje = await UserService.searchUsersPagination(page as string, size as string, nombre, email, role ? parseInt(role!) : -1 , sortField, sortOrder);
    res.status(mensaje.code).json(mensaje);
}