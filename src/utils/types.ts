type IRegisterUser = {
    email: string,
    password: string,
}

type IUserLogged = {
    email: string,
    password?: string,
    token?: string
}

type IUserProfile = {
    username: string,
    name: string,
    pfp: string,
    biography: string,
    siteUrl: string,
    location: string,
}

export {
    IRegisterUser,
    IUserLogged,
    IUserProfile
}