import {BcryptService} from "./BcryptService";
import {TokenService} from "./TokenService";
import {IHelperInitOption} from "./AuthenticationMiddlewaresInterfaces";

export class AuthenticationMiddlewares {
    static OPTIONS: IHelperInitOption = {
        jwtSecret: 'secret',
        isBearer: true,
        tokenPath: 'token',
        expiresIn: "1y"
    }

    static setup(options: IHelperInitOption) {
        AuthenticationMiddlewares.OPTIONS = options;
    }

    static passwordBcryptMiddleware = function (passwordField: string, bcryptPasswordPath: string) {
        return async (req: any, res: any, next: any) => {
            req[bcryptPasswordPath] = await BcryptService.bcryptPassword(req.body[passwordField]);
            next();
        }
    }

    static authorisationMiddleware = function (requiredRole: string) {
        return async (req: any, res: any, next: any) => {
            const roles: string[] = req.roles || [];

            if (!roles.includes(requiredRole)) {
                res.status(401)
                res.json({message: "access denied."})
                return;
            }

            next();
        }
    }

    static authenticationMiddleware = function () {
        return async (req: any, res: any, next: any) => {
            let token: string = req.headers[AuthenticationMiddlewares.OPTIONS.tokenPath];
            if (!token) token = AuthenticationMiddlewares.OPTIONS.isBearer ? token.split(" ")[1] : token;

            const tokenContent = TokenService.verifyToken(token, AuthenticationMiddlewares.OPTIONS.jwtSecret);
            req.roles = tokenContent?.roles || []

            next();
        }
    }

}
