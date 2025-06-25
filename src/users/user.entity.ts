import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type:'varchar',length: 255})
    name : string

    @Column({type: 'varchar', unique: true})
    email : string

    @Column({type: 'varchar'})
    password : string

    @Column({type: 'varchar',default: 'user'})
    role : string

    // CORREÇÃO AQUI: Permite que 'lastLogin' seja Date ou null
    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date | null; // <<< Adicionar '| null'

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
