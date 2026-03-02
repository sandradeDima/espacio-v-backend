"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middlewares/validate");
const clientes_schema_1 = require("../schemas/clientes.schema");
const clientes_controller_1 = require("../controllers/clientes.controller");
const router = (0, express_1.Router)();
router.get('/', clientes_controller_1.getAllClientes);
router.get('/search', clientes_controller_1.searchClientes);
//paginated search with filters 
router.get('/search-pagination', clientes_controller_1.searchClientesPagination);
router.get('/:id', clientes_controller_1.getClienteById);
router.post('/', (0, validate_1.validate)(clientes_schema_1.createClienteSchema), clientes_controller_1.createCliente);
router.put('/:id', (0, validate_1.validate)(clientes_schema_1.updateClienteSchema), clientes_controller_1.updateCliente);
router.delete('/:id', clientes_controller_1.deleteCliente);
exports.default = router;
