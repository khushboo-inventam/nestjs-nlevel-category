import { EntitySchema } from "typeorm";
import { DynamicColumn } from "./dynamic-column.entity";

export const DynamicColumnSchema = new EntitySchema<DynamicColumn>({
  name: "DynamicColumn",
  target: DynamicColumn,
  columns: {
    dynamic_id: {
      type: String,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    type: {
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
