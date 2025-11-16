export type TUser = {
    id?: string;
    email: string;
    firstName: string;
    lastName?: string;
    profilePicture?: string;
    role: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type TUserRegister = TUser & {
    password?: string;
    confirmPassword?: string;
};

export type TUserLogin = {
    email: string;
    password: string;
};
