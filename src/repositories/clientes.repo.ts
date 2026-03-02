import { pool } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Cliente = {
    id: number;
    nombre: string;
    email: string | null;
    telefono: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function findAll(): Promise<Cliente[]> {
    const [rows] = await pool.execute<(Cliente & RowDataPacket)[]>(
        'SELECT id, nombre, email, telefono, created_at as createdAt, updated_at as updatedAt FROM clientes ORDER BY created_at DESC'
    );
    return rows;
}

export async function findById(id: number): Promise<Cliente | null> {
    const [rows] = await pool.execute<(Cliente & RowDataPacket)[]>(
        'SELECT id, nombre, email, telefono, created_at as createdAt, updated_at as updatedAt FROM clientes WHERE id = ?',
        [id]
    );
    return rows[0] ?? null;
}

export async function findByEmail(email: string): Promise<Cliente | null> {
    const [rows] = await pool.execute<(Cliente & RowDataPacket)[]>(
        'SELECT id, nombre, email, telefono, created_at as createdAt, updated_at as updatedAt FROM clientes WHERE email = ?',
        [email]
    );
    return rows[0] ?? null;
}

export async function create(nombre: string, email: string | null, telefono: string): Promise<Cliente> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        [nombre, email, telefono]
    );
    const cliente = await findById(result.insertId);
    if (!cliente) throw new Error('Failed to create cliente');
    return cliente;
}

export async function update(id: number, nombre: string, email: string | null, telefono: string): Promise<Cliente | null> {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [nombre, email, telefono, id]
    );
    if (result.affectedRows === 0) return null;
    return await findById(id);
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM clientes WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

export async function search(query: string): Promise<Cliente[]> {
    const searchPattern = `%${query}%`;
    const [rows] = await pool.execute<(Cliente & RowDataPacket)[]>(
        'SELECT id, nombre, email, telefono, created_at as createdAt, updated_at as updatedAt FROM clientes WHERE nombre LIKE ? OR email LIKE ? OR telefono LIKE ? ORDER BY nombre',
        [searchPattern, searchPattern, searchPattern]
    );
    return rows;
}
export async function searchPagination(
  page: number,
  size: number,
  clientName?: string,
  clientEmail?: string,
  clientPhone?: string,
  sortField?: string,
  sortOrder?: string,
): Promise<{ clientes: Cliente[]; total: number }> {
  const safePage = Math.max(1, page | 0);
  const safeSize = Math.max(1, size | 0);
  const offset = (safePage - 1) * safeSize;

  const clauses: string[] = [];
  const params: any[] = [];

  const name = clientName?.trim();
  const email = clientEmail?.trim();
  const phone = clientPhone?.trim();

  if (name) {
    clauses.push('nombre LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    clauses.push('email LIKE ?');
    params.push(`%${email}%`);
  }
  if (phone) {
    clauses.push('telefono LIKE ?');
    params.push(`%${phone}%`);
  }

  let baseQuery =
    'SELECT id, nombre, email, telefono, created_at AS createdAt, updated_at AS updatedAt FROM clientes';
  let countQuery = 'SELECT COUNT(*) AS total FROM clientes';

  if (clauses.length) {
    const whereClause = ' WHERE ' + clauses.join(' OR ');
    baseQuery += whereClause;
    countQuery += whereClause;
  }

  const allowedSortFields = new Set(['id', 'nombre', 'created_at']);
  const safeSortField = sortField && allowedSortFields.has(sortField) ? sortField : 'id';
  const safeSortOrder = sortOrder?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const paginatedQuery = `${baseQuery} ORDER BY ${safeSortField} ${safeSortOrder} LIMIT ${safeSize} OFFSET ${offset}`;

  const [rows] = await pool.execute<(Cliente & RowDataPacket)[]>(paginatedQuery, params);
  const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, params);
  const total = Number(countRows[0]?.total ?? 0);

  return {
    clientes: rows,
    total,
  };
}
