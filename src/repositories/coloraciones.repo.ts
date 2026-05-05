import { pool } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Coloracion = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function findAll(): Promise<Coloracion[]> {
    const [rows] = await pool.execute<(Coloracion & RowDataPacket)[]>(
        'SELECT id, nombre, descripcion, precio, created_at as createdAt, updated_at as updatedAt FROM coloraciones ORDER BY nombre'
    );
    return rows;
}

export async function findById(id: number): Promise<Coloracion | null> {
    const [rows] = await pool.execute<(Coloracion & RowDataPacket)[]>(
        'SELECT id, nombre, descripcion, precio, created_at as createdAt, updated_at as updatedAt FROM coloraciones WHERE id = ?',
        [id]
    );
    return rows[0] ?? null;
}

export async function create(
    nombre: string,
    descripcion: string,
    precio: number | null
): Promise<Coloracion> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO coloraciones (nombre, descripcion, precio) VALUES (?, ?, ?)',
        [nombre, descripcion, precio]
    );
    const coloracion = await findById(result.insertId);
    if (!coloracion) throw new Error('Failed to create coloracion');
    return coloracion;
}

export async function update(
    id: number,
    nombre: string,
    descripcion: string,
    precio: number | null
): Promise<Coloracion | null> {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE coloraciones SET nombre = ?, descripcion = ?, precio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [nombre, descripcion, precio, id]
    );
    if (result.affectedRows === 0) return null;
    return await findById(id);
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM coloraciones WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

export async function search(query: string): Promise<Coloracion[]> {
    const searchPattern = `%${query}%`;
    const [rows] = await pool.execute<(Coloracion & RowDataPacket)[]>(
        'SELECT id, nombre, descripcion, precio, created_at as createdAt, updated_at as updatedAt FROM coloraciones WHERE nombre LIKE ? OR descripcion LIKE ? ORDER BY nombre',
        [searchPattern, searchPattern]
    );
    return rows;
}
