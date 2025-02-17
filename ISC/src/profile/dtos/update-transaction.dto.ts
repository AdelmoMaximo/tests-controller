import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TransactionsEntity } from "../entities/transactions.entity";

export class UpdateTransactionDto extends OmitType(TransactionsEntity,['profile','transactions_id','profile_id','transactions_status']){
    @ApiProperty()
    transactions_cod: number;

    @ApiProperty()
    transactions_description: string;

    @ApiProperty()
    transactions_url: string;
}