import { pool } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Reporte = {
    id: number;
    clienteId: number;
    fechaServicio: string;
    horaServicio: string;
    formula: string;
    observaciones: string;
    precio: number;
    createdAt: Date;
    updatedAt: Date;
}

export type ReporteDetallado = Reporte & {
    clienteNombre?: string;
    clienteEmail?: string;
    coloracion?: string;
    coloracion_desc?: string;
}

export async function findAll(): Promise<ReporteDetallado[]> {
    const [rows] = await pool.execute<(ReporteDetallado & RowDataPacket)[]>(
        `SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        ORDER BY r.fecha_servicio DESC, r.hora_servicio DESC`
    );
    return rows;
}

export async function findById(id: number): Promise<ReporteDetallado | null> {
    const [rows] = await pool.execute<(ReporteDetallado & RowDataPacket)[]>(
        `SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        WHERE r.id = ?`,
        [id]
    );
    return rows[0] ?? null;
}

export async function findByCliente(clienteId: number): Promise<ReporteDetallado[]> {
    const [rows] = await pool.execute<(ReporteDetallado & RowDataPacket)[]>(
        `SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        WHERE r.cliente_id = ?
        ORDER BY r.fecha_servicio DESC, r.hora_servicio DESC`,
        [clienteId]
    );
    return rows;
}

export async function create(
    clienteId: number,
    fechaServicio: string,
    horaServicio: string,
    coloracionId: number,
    formula: string,
    observaciones: string,
    precio: number
): Promise<ReporteDetallado> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO reportes (cliente_id, fecha_servicio, hora_servicio, coloracion_id, formula, observaciones, precio) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio]
    );
    const reporte = await findById(result.insertId);
    if (!reporte) throw new Error('Failed to create reporte');
    return reporte;
}

export async function update(
    id: number,
    clienteId: number,
    coloracionId: number,
    formula: string,
    observaciones: string,
    precio: number
): Promise<ReporteDetallado | null> {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE reportes SET cliente_id = ?, coloracion_id = ?, formula = ?, observaciones = ?, precio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [clienteId, coloracionId, formula, observaciones, precio, id]
    );
    if (result.affectedRows === 0) return null;
    return await findById(id);
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM reportes WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

export async function findByDateRange(startDate: Date, endDate: Date): Promise<ReporteDetallado[]> {
    const [rows] = await pool.execute<(ReporteDetallado & RowDataPacket)[]>(
        `SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        WHERE r.fecha_servicio BETWEEN ? AND ?
        ORDER BY r.fecha_servicio DESC, r.hora_servicio DESC`,
        [startDate, endDate]
    );
    return rows;
}
