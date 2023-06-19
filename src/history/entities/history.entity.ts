import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";
  
  @Entity({ name: "history" })
  export class History {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column()
    module: string;
  
    @Column()
    user_id: number;
  
    @Column()
    action: string;
  
    @Column()
    before: string;

    @Column()
    after: string;

    @Column()
    action_at: string;
  }
  