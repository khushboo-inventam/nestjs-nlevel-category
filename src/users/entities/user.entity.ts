import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  mobile_no: string;

  @Column({ nullable: true })
  forgot_password_token: string;

  @Column({ type: 'timestamp', default: () => 'NOW()', nullable: true })
  password_token_time: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  email_verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  email_token_time: string;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  created_at: string;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp',
  })
  updated_at: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp',
  })
  deleted_at: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ default: false })
  is_professional: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  company_email: string;

  @Column({ nullable: true })
  company_mobile_no: string;

  @Column({ nullable: true })
  company_website: string;

  @Column({ nullable: true })
  company_address: string;

  @Column({ nullable: true })
  facebook_link: string;

  @Column({ nullable: true })
  instagram_link: string;

  @Column({ nullable: true })
  other_social_link: string;
}
