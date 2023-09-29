// import { timestamp } from 'rxjs';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class UserSessions {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column({ default: false })
  is_expired: boolean;

  @Column({ default: true })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: string;

  @Column()
  user_agent: string;
}
