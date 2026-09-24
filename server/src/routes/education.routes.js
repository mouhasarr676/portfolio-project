import { Router } from 'express';
import { createCrudController } from '../utils/createCrudController.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = createCrudController('education', 'start_date');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

export default router;