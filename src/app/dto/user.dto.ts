export interface UserDto {
    email: string;
    id: string;
}

export type UserInfoDto = UserDto & {
    firstname: string;
    lastname: string;
}