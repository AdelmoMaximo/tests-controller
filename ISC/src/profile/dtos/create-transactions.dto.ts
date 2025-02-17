import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TransactionsEntity } from "../entities/transactions.entity";

export class CreateTransactionDto extends OmitType(TransactionsEntity,['profile','transactions_id']){
    @ApiProperty()
    profile_id: number;

    @ApiProperty()
    transactions_cod: number;

    @ApiProperty()
    transactions_status: boolean;

    @ApiProperty()
    transactions_description: string;

    @ApiProperty()
    transactions_url: string;
}