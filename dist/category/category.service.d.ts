import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
export declare class CategoryService {
    private readonly repo;
    constructor(repo: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        name: string;
    } & Category>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): void;
    remove(id: number): void;
}
