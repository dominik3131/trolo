export default class UserModel{
    id: number | undefined;
    username: string | undefined;
    password: string | undefined;
    last_active: Date  = new Date(Date.now());
}