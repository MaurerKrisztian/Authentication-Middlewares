const bcrypt = require('bcrypt');

export class BcryptService {

    static async bcryptPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSaltSync(saltRounds);
        const hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    }

    static async isMatchHashPassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }

}
