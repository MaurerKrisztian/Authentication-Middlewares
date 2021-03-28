import express from "express";
import bodyParser from "body-parser";
import {AuthenticationMiddlewares} from "../lib/AuthenticationMiddlewares";
import {BcryptService} from "../lib/BcryptService";
import {TokenService} from "../lib/TokenService";


const app = express();
app.use(bodyParser.json());

AuthenticationMiddlewares.setup({
    jwtSecret: 'secret',
    isBearer: false,
    tokenPath: 'token'
});

app.use(AuthenticationMiddlewares.authenticationMiddleware()); // get the roles every request


app.post('/registration', AuthenticationMiddlewares.passwordBcryptMiddleware('password', 'bcryptedPassword'), (req: any, res: any) => {
    console.log(req.body, req.bcryptedPassword)
    res.json({hashPass: req.bcryptedPassword});
})

app.post('/login', async (req: any, res: any) => {
    const isPassMatch = await BcryptService.isMatchHashPassword(req.body.password, "$2b$10$HszsoOR2TUYEZNorxlEXsu5ARNLgAFFjTxhdBCcQUpiebdZaG.1du") // the hash password what you get back by registration

    const token = await TokenService.signAccessToken({roles: ['admin']});
    res.json({token: token, isPassMatch: isPassMatch});
})

app.get('/', (req: any, res: any) => {
    res.json({
        roles: req.roles
    });
})

app.get('/secret', AuthenticationMiddlewares.authorisationMiddleware('admin'), (req: any, res: any) => {
    res.json({
        message: 'access enabled',
        roles: req.roles
    });
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
