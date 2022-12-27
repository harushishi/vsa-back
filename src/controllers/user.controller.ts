import e, { Request, Response } from 'express';
import { UserService } from "../services/user.service";
import { err_codes, msgs } from '../utils/err_handling';

const UserServiceInstance = new UserService()

const follow = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId)
    const followId = Number(req.params.followId)

    try {
        if (await UserServiceInstance.follow(userId, followId)) {
            res.status(200).send(msgs.followed)
        } else {
            res.status(200).send(msgs.unfollowed)
        }

    } catch (error: any) {
        if (error.code === err_codes.not_found) {
            res.status(404).send(msgs.user_not_found)
        } else {
            res.status(500).send(error)
        }
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserServiceInstance.getUsers()
        res.status(200).send(users)
    } catch (error: any) {
        if (error.message === "No users found") {
            res.status(404).send(error.message)
        } else {
            res.status(500).send(msgs.internal)
        }
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id)

        const user = await UserServiceInstance.getUser(userId)
        res.status(200).send(user)
    } catch (error: any) {
        if (error.code === err_codes.not_found) {
            res.status(404).send(error.message)
        } else {
            res.status(500).send(msgs.internal)
        }
    }
}

export {
    getUsers,
    getUser,
    follow
}