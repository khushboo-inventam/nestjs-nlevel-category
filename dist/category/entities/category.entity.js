"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Category_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const typeorm_1 = require("typeorm");
let Category = Category_1 = class Category {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Category.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Category.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Category.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Category.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Category.prototype, "deleted_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Category_1),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Category.prototype, "parent_category_id", void 0);
Category = Category_1 = __decorate([
    (0, typeorm_1.Entity)({ name: "category" })
], Category);
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map