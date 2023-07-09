/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO: Paginar
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 1 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: (offset - 1) * limit,
      // TODO: relaciones
    });

    if (!products) {
      throw new NotFoundException('Not found products in DB');
    }

    return products;
  }

  async findOne(term: string) {

    let product : Product;

    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug',{
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();
    }

    if (!product) {
      throw new NotFoundException(`Not found product with id ${term} in DB`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if( !product ) throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.delete({ id: id });
    return product;
  }

  private handleDBExceptions(error: any) {
    console.log(error);
    if (error.code ===  'ER_DUP_ENTRY' ) throw new BadRequestException(error.sqlMessage);

    this.logger.error(`Error: ${error}`);
    throw new InternalServerErrorException(
      'Unexpected Error, check server logs',
    );
  }
}
