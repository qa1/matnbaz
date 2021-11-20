import { ArgsType, Field, ID } from '@nestjs/graphql';
import { PlatformType } from '../enums/platform-type.enum';

@ArgsType()
export class PlatformArgs {
  @Field(() => ID)
  id: string;

  @Field(() => PlatformType)
  platform: PlatformType;
}
