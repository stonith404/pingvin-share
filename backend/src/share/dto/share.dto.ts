import { Expose, plainToClass, Type } from "class-transformer";
import { AuthSignInDTO } from "src/auth/dto/authSignIn.dto";
import { FileDTO } from "src/file/dto/file.dto";

export class ShareDTO {
  @Expose()
  id: string;

  @Expose()
  expiration: Date;

  @Expose()
  @Type(() => FileDTO)
  files: FileDTO[];

  @Expose()
  @Type(() => AuthSignInDTO)
  creator: AuthSignInDTO;

  from(partial: Partial<ShareDTO>) {
    return plainToClass(ShareDTO, partial, { excludeExtraneousValues: true });
  }

  fromList(partial: Partial<ShareDTO>[]) {
    return partial.map((part) =>
      plainToClass(ShareDTO, part, { excludeExtraneousValues: true })
    );
  }
}
