import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createReporteSchema, updateReporteSchema, generarDocumentoSchema } from '../schemas/reportes.schema';
import {
    getAllReportes,
    getReporteById,
    getReportesByCliente,
    createReporte,
    updateReporte,
    addFotosToReporte,
    deleteReporte,
    getReportesByDateRange,
    createReporteCompleto,
    generarDocumento
} from '../controllers/reportes.controller';
import { uploadImages } from '../middlewares/upload';

const router = Router();
router.get('/', getAllReportes);
router.get('/date-range', getReportesByDateRange);
router.get('/cliente/:clienteId', getReportesByCliente);
router.get('/:id', getReporteById);
router.post('/', validate(createReporteSchema), createReporte);
router.post('/completo', uploadImages.array('fotos'), createReporteCompleto);
router.post('/:id/fotos', uploadImages.array('fotos'), addFotosToReporte);
router.put('/:id', validate(updateReporteSchema), updateReporte);
router.delete('/:id', deleteReporte);
router.post('/generarDocumento', validate(generarDocumentoSchema), generarDocumento);
export default router;
