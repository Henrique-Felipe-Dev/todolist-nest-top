import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Categoria } from "../entities/categoria.entity";

export class CategoriaService{

    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ){}

    async findAll(): Promise<Categoria[]>{
        return this.categoriaRepository.find()
    }

    async findById(id: number): Promise<Categoria>{
        return this.categoriaRepository.findOne({
            where: {
                id
            }
        })
    }

    async findByDescricao(descricao: string): Promise<Categoria[]>{
        let categoria = await this.categoriaRepository.find({
            where: {
                descricao: ILike(`%${descricao}%`)
            }
        })

        if(!categoria)
            throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND)

        return categoria

    }

    async create(categoria: Categoria): Promise<Categoria>{
        return this.categoriaRepository.save(categoria)
    }

    async update(categoria: Categoria): Promise<Categoria>{

        let categoriaUpdate = await this.findById(categoria.id)

        if(!categoriaUpdate || !categoria.id)
            throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND)

        return this.categoriaRepository.save(categoria)
    }

    async delete(id: number): Promise<DeleteResult>{
        let categoriaDelete = await this.findById(id)

        if(!categoriaDelete)
            throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND)

        return this.categoriaRepository.delete(categoriaDelete)
    }

}