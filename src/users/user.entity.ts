import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`User ${this.id} inserted`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User ${this.id} updated`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User ${this.id} removed`);
  }
}
