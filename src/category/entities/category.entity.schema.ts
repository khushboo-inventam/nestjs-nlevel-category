import { EntitySchema } from "typeorm";
import { Category } from "./category.entity";

export const CategorySchema = new EntitySchema<Category>({
  name: "Category",
  target: Category,
  columns: {
    category_id: {
      type: String,
      primary: true,
      generated: true,
    },
    parent_category_id: {
      type: Number,
    },
    name: {
      type: String,
    },
    is_deleted: { type: Boolean },
    
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
    deleted_by: {
      type: String,
    },
    created_at: {
      type: String,
    },
    updated_at: {
      type: String,
    },
    deleted_at: {
      type: String,
    },
  },
});
