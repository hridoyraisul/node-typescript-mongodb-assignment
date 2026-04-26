import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'Parent category not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error', error: error?.message, stack: error?.stack });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.getCategoryById(id);
    return res.status(200).json(category);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'Category not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.updateCategory(id, req.body);
    return res.status(200).json(category);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'Parent category not found' || error.message === 'Category not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deactivateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const response = await CategoryService.deactivateCategory(id);
    return res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    if (error.message === 'Category not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
