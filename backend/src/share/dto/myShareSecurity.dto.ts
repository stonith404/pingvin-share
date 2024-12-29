import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class MyShareSecurityDTO {
	@IsBoolean()
	passwordProtected: boolean;

	@IsNumber()
	@IsOptional()
	maxViews: number;
}
