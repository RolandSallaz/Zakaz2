import { PartialType } from '@nestjs/mapped-types';
import { CreateItemSelectorDto } from './create-item-selector.dto';

export class UpdateItemSelectorDto extends PartialType(CreateItemSelectorDto) {}
