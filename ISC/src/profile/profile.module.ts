import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { ProfileController } from "./controllers/profile.controller";
import { TransactionsController } from "./controllers/transactions.controller";
import { ProfileEntity } from "./entities/profile.entity";
import { TransactionsEntity } from "./entities/transactions.entity";
import { ProfileService } from "./shared/profile.service";
import { TransactionsService } from "./shared/transactions.service";

@Module({
    imports:[
        UsersModule,
        TypeOrmModule.forFeature([ProfileEntity,TransactionsEntity])
    ],
    providers:[ProfileService,TransactionsService],
    controllers:[ProfileController,TransactionsController],
    exports:[ProfileService],
})
export class ProfileModule {}