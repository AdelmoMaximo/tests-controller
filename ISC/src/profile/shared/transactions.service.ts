import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { converteBooleanToBit } from "src/common/utils/boolean.bit";
import { NameValidate } from "src/common/utils/name.validate";
import { Repository } from "typeorm";
import { CreateTransactionDto } from "../dtos/create-transactions.dto";
import { UpdateTransactionDto } from "../dtos/update-transaction.dto";
import { TransactionsEntity } from "../entities/transactions.entity";
import { ProfileService } from "./profile.service";

@Injectable()
export class TransactionsService{
    constructor(
        @InjectRepository(TransactionsEntity)
        private readonly transactionsRepository: Repository<TransactionsEntity>,
    ){}
    async getById(id:number){
        return this.transactionsRepository.findOne({where:{transactions_id:id}})
    }
    async getAllById(id:number){
        return this.transactionsRepository.find({where:{profile_id:id}});
    }
    async createTransaction(createDto:CreateTransactionDto){
        const newTransaction = this.transactionsRepository.create(createDto);
        const lastDigit = newTransaction.transactions_cod %10;

        newTransaction.transactions_status = !converteBooleanToBit(newTransaction.transactions_status)
        
        if(newTransaction.transactions_cod === 0){ 
            newTransaction.transactions_description = 'Restrict';
        }
        else {
            if(lastDigit==0) newTransaction.transactions_description = 'Total';
            if(lastDigit==1) newTransaction.transactions_description = 'Edit';
            if(lastDigit==2) newTransaction.transactions_description = 'View';

        }
        NameValidate.getInstance().getValidTransaction(newTransaction.transactions_cod);

        return this.transactionsRepository.save(newTransaction);
    }
    async getAll(){
        return this.transactionsRepository.find();
    }
    async delete(id:number){
        const transactions = await this.transactionsRepository.createQueryBuilder('transaction')
        .where('transaction.profile_id = :id',{id})
        .getMany();
        transactions.forEach(transaction =>{
           this.transactionsRepository.remove(transaction);
        })
    }
    async update(update:UpdateTransactionDto,id:number){
        const transaction = await this.getById(id);
        let flag = true;
        NameValidate.getInstance().getValidTransaction(update.transactions_cod);
        transaction.transactions_cod =  update.transactions_cod;
        transaction.transactions_description = update.transactions_description;
        transaction.transactions_url = update.transactions_url;
        const profile = await this.getAllById(transaction.profile_id);
        profile.forEach(transact =>{
            if(transact.transactions_cod !=0 && transact.transactions_id != id) flag = false;
        })

        //if(flag) throw new BadRequestException('Ao menos uma transaction não deve ser restrita!')

        return this.transactionsRepository.save(transaction);
    }
}