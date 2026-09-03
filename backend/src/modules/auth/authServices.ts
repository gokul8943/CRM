import * as AuthRepository from "./authRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "../../helper/authHelper";

export const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    password: string
) => {

    const existingUser = await AuthRepository.findUserByEmailOrMobile(email, mobile);

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser(
        firstName,
        lastName,
        email,
        mobile,
        hashedPassword
    );

    return user;
};


export const loginUser = async (
    identifier: string,
    password: string
) => {
    const user = await AuthRepository.findUserByIdentifier(identifier);

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    // -------------------------
    // Access Token
    // -------------------------
    const accessToken = jwt.sign(
        {
            id: user._id.toString(),
            email: user.email,
            type: "access",
        },
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: "15m",
        }
    );

    // -------------------------
    // Refresh Token
    // -------------------------
    const refreshToken = jwt.sign(
        {
            id: user._id.toString(),
            type: "refresh",
        },
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: "7d",
        }
    );

    return {
        user: {
            id: user._id,
            email: user.email,
            mobile: user.mobile,
        },
        accessToken,
        refreshToken,
    };
};


export const sendOtp = async (email: string) => {
    const user = await AuthRepository.findUserByEmailOrMobile(email, "");

    if (!user) {
        throw new Error("User not found");
    }
    const otp = generateOtp();
    return otp;
}


export const verifyOtp = async (email: string, otp: string) => {
    const user = await AuthRepository.verifyOtp(email, otp);

    if (!user) {
        throw new Error("Invalid OTP");
    }
    return user;
}

