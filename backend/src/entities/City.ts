import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { User } from './User';

/**
 * City entity representing the cities table
 * Contains predefined Israeli cities that users can be associated with
 */
@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index('IDX_CITY_NAME')
  name!: string;

  // Relationship: One city can have many users
  @OneToMany(() => User, (user) => user.city)
  users!: User[];

  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }
} 