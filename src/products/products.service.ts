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
  async findAll() {
    const products = await this.productRepository.find();

    if (!products) {
      throw new NotFoundException('Not found products in DB');
    }

    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({
      id: id,
    });

    if (!product) {
      throw new NotFoundException(`Not found product with id ${id} in DB`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.delete({ id: id });
    return product;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error: ${error}`);
    throw new InternalServerErrorException(
      'Unexpected Error, check server logs',
    );
  }
}
