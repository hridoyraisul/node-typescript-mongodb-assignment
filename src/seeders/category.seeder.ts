import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { CategoryModel } from '../models/category.model';
import redisClient from '../config/redis';

dotenv.config();

const seedCategories = async () => {
  try {
    await connectDB();
    await redisClient.connect();

    console.log('Clearing existing categories...');
    await CategoryModel.deleteMany({});
    

    const keys = await redisClient.keys('category:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    await redisClient.del('categories:all');

    console.log('Seeding categories with >5 nested layers...');


    const level1 = await CategoryModel.create({ name: 'Electronics', parentId: null });
    console.log(`Layer 1 created: ${level1.name}`);


    const level2 = await CategoryModel.create({ name: 'Computers & Accessories', parentId: level1._id });
    console.log(`Layer 2 created: ${level2.name}`);


    const level3 = await CategoryModel.create({ name: 'Laptops', parentId: level2._id });
    console.log(`Layer 3 created: ${level3.name}`);


    const level4 = await CategoryModel.create({ name: 'Gaming Laptops', parentId: level3._id });
    console.log(`Layer 4 created: ${level4.name}`);


    const level5 = await CategoryModel.create({ name: 'High Performance', parentId: level4._id });
    console.log(`Layer 5 created: ${level5.name}`);


    const level6 = await CategoryModel.create({ name: 'RTX 4090 Series', parentId: level5._id });
    console.log(`Layer 6 created: ${level6.name}`);
    

    const level7 = await CategoryModel.create({ name: 'Asus ROG Strix', parentId: level6._id });
    console.log(`Layer 7 created: ${level7.name}`);

    console.log('Seeding completed successfully!');
    
    await mongoose.connection.close();
    await redisClient.quit();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedCategories();
