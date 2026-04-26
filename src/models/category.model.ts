import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  isActive: boolean;
  parentId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
