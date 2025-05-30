import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class FindItemQueryDto {
    @IsOptional()
    @IsString()
    find: string = '';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    itemsInPage: number = 20;

    @IsOptional()
    @IsString()
    category?: string;
}