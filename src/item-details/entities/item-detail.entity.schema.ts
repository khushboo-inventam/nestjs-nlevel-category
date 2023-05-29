import { EntitySchema } from "typeorm";
import { ItemDetail } from "./item-detail.entity";

export const ItemDetailSchema = new EntitySchema<ItemDetail>({
  name: "ItemDetail",
  target: ItemDetail,
  columns: {
    item_detail_id: {
      type: Number,
      primary: true,
      generated: true,
    },
    value: {
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
    dynamic_col_id: {
      type: Number,
    },
    items_id: {
      type: Number
    }
  }
//   ,relations: {
//     dynamic_id: {
//         type: "one-to-one",
//         target: "DynamicColumn", // CategoryEntity
//     },
//     item_id: {
//       type: "one-to-one",
//       target: "Item", // CategoryEntity
//   }
// }
});
