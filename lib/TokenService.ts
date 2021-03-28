import {AuthenticationMiddlewares} from "./AuthenticationMiddlewares";
import {ITokenInfo} from "./AuthenticationMiddlewaresInterfaces";

const jwt = require("jsonwebtoken");

export class TokenService {

    static async signAccessToken(TokenInformation: ITokenInfo) {
        return jwt.sign(TokenInformation, AuthenticationMiddlewares.OPTIONS.jwtSecret, {expiresIn: AuthenticationMiddlewares.OPTIONS.expiresIn || '1y'});
    }

    static verifyToken(token: string, secret: string) {
        if (!token) return;
        const content = jwt.verify(token, secret);
        return content;
    }

}
