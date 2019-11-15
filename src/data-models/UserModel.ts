export default class UserModel{
    id: number | undefined;
    login: string | undefined;
    password: string | undefined;
    last_active: Date  = new Date(Date.now());
}