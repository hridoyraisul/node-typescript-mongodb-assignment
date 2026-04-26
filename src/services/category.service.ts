import redisClient from '../config/redis';
import { ICreateCategory, IUpdateCategory, ICategoryResponse } from '../interfaces/category.interface';
import { CategoryModel } from '../models/category.model';
import mongoose from 'mongoose';

export class CategoryService {

  public static async clearCache(): Promise<void> {
    const keys = await redisClient.keys('category:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    await redisClient.del('categories:all');
  }

  public static async createCategory(data: ICreateCategory) {
    if (data.parentId) {
      const parent = await CategoryModel.findById(data.parentId);
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const category = await CategoryModel.create({
      name: data.name,
      parentId: data.parentId || null
    });

    await this.clearCache();
    return category.toJSON();
  }

  public static async getCategories() {
    const cacheKey = 'categories:all';
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const categories = await CategoryModel.find({ isActive: true });

    const categoryMap = new Map<string, any>();
    const tree: any[] = [];


    categories.forEach(c => {
      const cat = c.toJSON() as any;
      cat.children = [];
      categoryMap.set(cat.id.toString(), cat);
    });


    categories.forEach(c => {
      const catId = (c._id as mongoose.Types.ObjectId).toString();
      const cat = categoryMap.get(catId);
      
      if (c.parentId) {
        const parentIdStr = c.parentId.toString();
        const parent = categoryMap.get(parentIdStr);
        if (parent) {
          parent.children.push(cat);
        } else {
          tree.push(cat);
        }
      } else {
        tree.push(cat);
      }
    });

    await redisClient.set(cacheKey, JSON.stringify(tree), { EX: 3600 });
    return tree;
  }

  public static async getCategoryById(id: string): Promise<ICategoryResponse> {
    const cacheKey = `category:${id}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const category = await CategoryModel.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }


    const parentHierarchy: any[] = [];
    let currentParentId = category.parentId;
    
    while (currentParentId) {
      const parent = await CategoryModel.findById(currentParentId);
      if (parent) {
        parentHierarchy.unshift(parent.toJSON());
        currentParentId = parent.parentId;
      } else {
        currentParentId = null;
      }
    }

    const responseData: any = {
      ...category.toJSON(),
      parents: parentHierarchy
    };

    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 });
    return responseData;
  }

  public static async updateCategory(id: string, data: IUpdateCategory) {
    if (data.parentId) {
      const parent = await CategoryModel.findById(data.parentId);
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;

    const category = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!category) {
        throw new Error('Category not found');
    }

    await this.clearCache();
    return category.toJSON();
  }


  private static async getDescendantIds(parentId: string): Promise<string[]> {
    const children = await CategoryModel.find({ parentId });
    
    let ids = children.map(c => (c._id as mongoose.Types.ObjectId).toString());
    
    for (const child of children) {
      const childDescendants = await this.getDescendantIds((child._id as mongoose.Types.ObjectId).toString());
      ids = ids.concat(childDescendants);
    }
    
    return ids;
  }

  public static async deactivateCategory(id: string): Promise<{ message: string, deactivatedIds: string[] }> {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    const descendantIds = await this.getDescendantIds(id);
    const allIdsToDeactivate = [id, ...descendantIds];

    await CategoryModel.updateMany(
      { _id: { $in: allIdsToDeactivate } },
      { $set: { isActive: false } }
    );

    await this.clearCache();
    return { 
      message: 'Category and all child categories deactivated successfully',
      deactivatedIds: allIdsToDeactivate
    };
  }
}
