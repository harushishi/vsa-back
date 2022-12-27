import e, { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { err_codes, msgs } from '../utils/err_handling';
import { IRegisterUser } from '../utils/types';

class RegisterUserDTO {
    email;
    password;

    constructor(data: IRegisterUser) {
        this.email = data.email;
        this.password = data.password;
    }
}

const AuthServiceInstance = new AuthService()

const login = async (req: Request, res: Response) => {
    try {
        const loggedUser = await AuthServiceInstance.login(new RegisterUserDTO(req.body))

        res.status(200).send(loggedUser)
    } catch (error: any) {

        if (error.code === err_codes.not_found ||
            error.message === msgs.inv_credentials) {

            res.status(403).send(msgs.inv_credentials)

        } else {
            res.status(500).send(error.code)
        }
    }
}

const register = async (req: Request, res: Response) => {
    try {
        await AuthServiceInstance.register(new RegisterUserDTO(req.body))
        res.status(200).send()
    } catch (error: any) {
        if (error.code === err_codes.unique_constraint) {
            res.status(400).send(msgs.email_taken)
        } else {
            res.status(500).send(error.code)
        }
    }
}

export { register, login }

