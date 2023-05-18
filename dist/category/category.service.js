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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const category_entity_1 = require("./entities/category.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CategoryService = class CategoryService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(createCategoryDto) {
        let parentId = 0;
        let parentData = [];
        let parentRelation = {};
        if (typeof createCategoryDto === "object" &&
            "parent_category_id" in createCategoryDto) {
            parentId = +createCategoryDto.parent_category_id;
            console.log("this.repo", this.repo);
            parentData = await this.repo.find({
                where: { category_id: +createCategoryDto.parent_category_id },
            });
            parentRelation = { parent_category_id: parentData };
        }
        console.log("parentData", parentData);
        const data = await this.repo.save(Object.assign({ name: createCategoryDto.name }, parentRelation));
        return data;
    }
    async findAll() {
        console.log("this.repo", this.repo);
        const data = await this.repo.find({
            select: {
                name: true,
                category_id: true,
                parent_category_id: true,
            },
            join: {
                alias: "cat",
                leftJoinAndSelect: {
                    category_parent_category_id_category: "cat.parent_category_id",
                },
            },
            where: {
                parent_category_id: true,
            },
        });
        return data;
    }
    findOne(id) {
        return this.repo.findOne({
            relations: { parent_category_id: true },
            where: { category_id: id },
        });
    }
    update(id, updateCategoryDto) {
    }
    remove(id) {
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map