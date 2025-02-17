import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { PublicRoute } from "src/common/decorators/public-route.decorator";
import { CreateTransactionDto } from "../dtos/create-transactions.dto";
import { UpdateTransactionDto } from "../dtos/update-transaction.dto";
import { TransactionsService } from "../shared/transactions.service";

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController{
    constructor(
        private readonly transactionsService:TransactionsService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Profile.CREATE))
    async createTransaction(
        @Body() transactionDto:CreateTransactionDto
    ){
        return this.transactionsService.createTransaction(transactionDto);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Profile.FIND_BY_ID))
    async getOne(
        @Param('id') id:number
    ){
        return this.transactionsService.getById(id);
    }

    @Get()
    @UseGuards(PermissionGuard(Permission.Profile.FIND_ALL))
    async getAll(){
        return this.transactionsService.getAll();
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Profile.UPDATE))
    async update(
        @Param('id') id:number,
        @Body() update:UpdateTransactionDto
    ){
        return this.transactionsService.update(update,id);
    }
    
}