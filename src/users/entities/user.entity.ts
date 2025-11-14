import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

// Solo email y password
@Entity({ name: 'users' })
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Profile, { cascade: true, nullable: false})
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({type: 'varchar', length: 300, unique: true})
  email: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

}
