import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory
} from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { 
  createCategorySchema, 
  updateCategorySchema, 
  categoryIdParamSchema 
} from '../validators/category.validator';

const router = Router();

router.post('/', validate(createCategorySchema), createCategory);
router.get('/', getCategories);
router.get('/:id', validate(categoryIdParamSchema), getCategoryById);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.patch('/:id/deactivate', validate(categoryIdParamSchema), deactivateCategory);

export default router;
