class User {
    userName: string;
    passWord: string;

    constructor(userName: string, passWord: string) {
        this.userName = userName
        this.passWord = passWord
    }
}

export const baseUser = new User('standard_user', 'secret_sauce')
