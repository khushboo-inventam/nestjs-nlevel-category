import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    console.log('this.repo', this.repo);
    const parentData = await this.repo.find({where:{ category_id: +createCategoryDto.parent_category_id}});
    console.log('parentData',parentData)
    const data = await this.repo.save(
      {
        name: createCategoryDto.name,
         parent_category_id: parentData
      }
    );
    return data;
  }

  async findAll() {
    console.log('this.repo', this.repo);
    const data = await this.repo.find();
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
