import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import * as argon from "argon2";
import * as moment from "moment";
import {ConfigService} from "src/config/config.service";
import {PrismaService} from "src/prisma/prisma.service";
import {AuthRegisterDTO} from "./dto/authRegister.dto";
import {AuthSignInDTO} from "./dto/authSignIn.dto";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService
    ) {
    }

    async signUp(dto: AuthRegisterDTO) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    password: hash,
                    isAdmin: !this.config.get("SETUP_FINISHED"),
                },
            });

            const accessToken = await this.createAccessToken(user);
            const refreshToken = await this.createRefreshToken(user.id);

            return {accessToken, refreshToken};
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    const duplicatedField: string = e.meta.target[0];
                    throw new BadRequestException(
                        `A user with this ${duplicatedField} already exists`
                    );
                }
            }
        }
    }

    async signIn(dto: AuthSignInDTO) {
        if (!dto.email && !dto.username)
            throw new BadRequestException("Email or username is required");

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{email: dto.email}, {username: dto.username}],
            },
        });

        if (!user || !(await argon.verify(user.password, dto.password)))
            throw new UnauthorizedException("Wrong email or password");

        const accessToken = await this.createAccessToken(user);
        const refreshToken = await this.createRefreshToken(user.id);

        return {accessToken, refreshToken};
    }

    async updatePassword(user: User, oldPassword: string, newPassword: string) {
        if (argon.verify(user.password, oldPassword))
            throw new ForbiddenException("Invalid password");

        const hash = await argon.hash(newPassword);

        this.prisma.user.update({
            where: {id: user.id},
            data: {password: hash},
        });
    }

    async createAccessToken(user: User) {
        return this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
            },
            {
                expiresIn: "15min",
                secret: this.config.get("JWT_SECRET"),
            }
        );
    }

    async refreshAccessToken(refreshToken: string) {
        const refreshTokenMetaData = await this.prisma.refreshToken.findUnique({
            where: {token: refreshToken},
            include: {user: true},
        });

        if (!refreshTokenMetaData || refreshTokenMetaData.expiresAt < new Date())
            throw new UnauthorizedException();

        return this.createAccessToken(refreshTokenMetaData.user);
    }

    async createRefreshToken(userId: string) {
        const refreshToken = (
            await this.prisma.refreshToken.create({
                data: {userId, expiresAt: moment().add(3, "months").toDate()},
            })
        ).token;

        return refreshToken;
    }

    async enableTotp(userId: string) {
        // Check if we have a secret already
        const {totpEnabled} = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {totpEnabled: true},
        });

        // TODO: Confirm the user's password before enabling TOTP

        if (totpEnabled) {
            throw new BadRequestException("TOTP is already enabled");
        } else {
            // TODO: Maybe make the issuer/name/length configurable with env vars?
            const {base32, otpauth_url} = speakeasy.generateSecret({
                issuer: "pingvin-share",
                name: "pingvin-share",
                length: 20,
            });

            // await this.prisma.user.update({
            //     where: {id: userId},
            //     data: {
            //         totpEnabled: true,
            //         totpSecret: base32,
            //         totpAuthUrl: otpauth_url,
            //     }
            // });

            // TODO: Maybe we should generate the QR code on the client rather than the server?
            const qrCode = await qrcode.toDataURL(otpauth_url);

            return {totpAuthUrl: otpauth_url, totpSecret: base32, qrCode};
        }
    }
}
