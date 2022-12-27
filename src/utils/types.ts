type IRegisterUser = {
    email: string,
    password: string,
}

type IUserLogged = {
    email: string,
    password?: string,
    token?: string
}

export {
    IRegisterUser,
    IUserLogged
}