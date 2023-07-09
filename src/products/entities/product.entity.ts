/* eslint-disable prettier/prettier */
import { BeforeInsert, BeforeUpdate, Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
 // @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('varchar', {
    nullable: true,
  })
  description: string;

  @Column('varchar', {
    unique: true,
  })
  slug: string;

  @Column('integer', {
    default: 0,
  })
  stock: number;

  @Column('simple-array')
  sizes: string[];

  @Column('varchar')
  gender: string;

  @Column('simple-array',{
    nullable: true
  })
  tags: string[];


  @BeforeInsert()
  checkLogsInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkLogsUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  //images
}
