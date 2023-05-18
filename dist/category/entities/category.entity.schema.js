"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
exports.CategorySchema = new typeorm_1.EntitySchema({
    name: "Category",
    target: category_entity_1.Category,
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
//# sourceMappingURL=category.entity.schema.js.map