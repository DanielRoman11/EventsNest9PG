import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attende{
  @PrimaryGeneratedColumn()
  id: number
}