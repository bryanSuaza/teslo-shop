import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  //tags
  //images
}
