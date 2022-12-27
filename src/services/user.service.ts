import prisma from '../../client'
import fs from 'fs'
import util from 'util'
import { BucketService } from '../../s3'

export class UserService {
    unlinkFile: (path: fs.PathLike) => Promise<void>
    S3: BucketService

    constructor() {
        this.unlinkFile = util.promisify(fs.unlink)
        this.S3 = new BucketService()
    }

    async follow(userId: number, followId: number) {
        try {

            const user = await prisma.
                user.findUniqueOrThrow({
                    where: {
                        id: userId
                    }
                })

            const userToFollow = await prisma.
                user.findUniqueOrThrow({
                    where: {
                        id: followId
                    }
                })

            //miro que el usuario no lo este siguiendo ya
            const isFollowing = await prisma
                .follow.findFirst(({
                    where: {
                        followingId: userId,
                        followedId: followId
                    }
                }))
            //si no encuentra el follow, lo sigue.
            if (!isFollowing) {
                await prisma.follow.create({
                    data: {
                        followingId: userId,
                        followedId: followId
                    }
                })
                return true
            }
            //si ya lo sigue, cancela el follow
            await prisma.follow.delete({
                where: {
                    id: isFollowing.id
                }
            })

            return false


        } catch (error: any) {
            throw error
        }

    }

    async getUsers() {
        try {

            const result = await prisma.user.findMany({

            })

            if (!result.length) {
                throw new Error("No users found")
            }

            return result
        } catch (error) {
            throw error
        }
    }

    async getUser(userId: number) {
        try {

            const result = await prisma.user.findUniqueOrThrow({
                where: {
                    id: userId
                }
            })

            return result

        } catch (error: any) {
            throw error
        }
    }
}