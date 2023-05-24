import { EntitySchema } from "typeorm";
import { Item } from "./item.entity";

export const ItemSchema = new EntitySchema<Item>({
  name: "Item",
  target: Item,
  columns: {
    item_id: {
      type: String,
      primary: true,
      generated: true,
    },
    item_code: {
      type: String,
    },
    name: {
      type: String,
    },
    item_description: {
      type: String,
    },
    image: {
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
