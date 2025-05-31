import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index 
} from 'typeorm';
import { IsNotEmpty, IsString, IsDateString, Matches } from 'class-validator';
import { City } from './City';

/**
 * User entity representing the users table
 * Contains user information with required fields and timestamps
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Index('IDX_USER_FIRST_NAME')
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Index('IDX_USER_LAST_NAME')
  lastName!: string;

  @Column({ type: 'timestamp', precision: 0 })
  @IsNotEmpty({ message: 'Birth date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Birth date must be in YYYY-MM-DD format' })
  birthDate!: Date;

  // Foreign key relationship to City
  @Column({ name: 'city_id' })
  cityId!: number;

  @ManyToOne(() => City, (city) => city.users, { 
    eager: true,
    onDelete: 'RESTRICT' // Prevent deletion of cities that have users
  })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  constructor(
    firstName?: string,
    lastName?: string,
    birthDate?: Date,
    cityId?: number
  ) {
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (birthDate) this.birthDate = birthDate;
    if (cityId) this.cityId = cityId;
  }
} 