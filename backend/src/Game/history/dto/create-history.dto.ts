import { IsNumber, IsString } from "class-validator";

export class historyDto {
    @IsString()
    opp_name: string;

    @IsNumber()
    opp_score: number;

    @IsNumber()
    my_score: number;
};