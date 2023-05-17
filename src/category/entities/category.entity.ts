import {
  Column,
  Entity,
  EntitySchema,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'uuid' })
  created_by: string;
  @Column({ nullable: true, type: 'uuid' })
  updated_by: string;
  @Column({ nullable: true, type: 'uuid' })
  deleted_by: string;
  @Column({ nullable: true, default: Date.now().toString() })
  created_at: string;
  @Column({ nullable: true })
  updated_at: string;
  @Column({ nullable: true })
  deleted_at: string;

  //   @Column({nullable: true})
  //   parent_category_id: number;
  @ManyToMany(() => Category)
  @JoinTable()
  parent_category_id: Category[];

}
