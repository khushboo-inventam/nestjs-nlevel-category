import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
export declare class CategoryService {
    private readonly repo;
    constructor(repo: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        name: string;
        parent_category_id: Category[];
    } & Category>;
    findAll(): Promise<Category[]>;
    findOne(id: number): string;
    update(id: number, updateCategoryDto: UpdateCategoryDto): string;
    remove(id: number): string;
}
