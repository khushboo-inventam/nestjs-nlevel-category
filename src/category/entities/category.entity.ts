import {
  Column,
  Entity,
 
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "category" })
export class Category {
  @PrimaryGeneratedColumn('increment')
  category_id: number;

  @Column()
  name: string;

  @Column()
  parent_category_id: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @Column({ nullable: true })
  deleted_by: string;

  @Column({ nullable: true })
  created_at: string;

  @Column({ nullable: true })
  updated_at: string;

  @Column({ nullable: true })
  deleted_at: string;


}
