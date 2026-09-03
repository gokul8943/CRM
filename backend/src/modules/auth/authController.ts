import type { Request, Response } from "express";
import * as AuthService from "./authServices"
import jwt from "jsonwebtoken";


export const signup = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, mobile, password } = req.body;

        if (!email || !mobile || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const newUser = await AuthService.signUp(
            firstName,
            lastName,
            email,
            mobile,
            password
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (error: any) {

        if (error.message === "User already exists") {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message:
                    "Identifier and password are required",
            });
        }

        const result =
            await AuthService.loginUser(
                identifier,
                password
            );

        const isProduction =
            process.env.NODE_ENV === "production";

        // Access Token
        res.cookie(
            "crm_access_token",
            result.accessToken,
            {
                httpOnly: true,

                secure: isProduction,

                sameSite: isProduction
                    ? "strict"
                    : "lax",

                maxAge:
                    15 * 60 * 1000,

                path: "/",
            }
        );

        // Refresh Token
        res.cookie(
            "crm_refresh_token",
            result.refreshToken,
            {
                httpOnly: true,

                secure: isProduction,

                sameSite: isProduction
                    ? "strict"
                    : "lax",

                maxAge:
                    7 * 24 * 60 * 60 * 1000,

                path: "/",
            }
        );

        return res.status(200).json({
            message:
                "User logged in successfully",

            user: result.user,
        });

    } catch (error: any) {

        if (
            error.message ===
            "User not found"
        ) {
            return res.status(401).json({
                message:
                    "Invalid username/email/mobile",
            });
        }

        if (
            error.message ===
            "Invalid password"
        ) {
            return res.status(401).json({
                message:
                    "Invalid password",
            });
        }

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

export const logout = async (
    req: Request,
    res: Response
) => {
    const isProduction =
        process.env.NODE_ENV === "production";

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction
            ? ("strict" as const)
            : ("lax" as const),
    };

    // Clear access token
    res.clearCookie(
        "crm_access_token",
        {
            ...cookieOptions,
            path: "/",
        }
    );

    // Clear refresh token
    res.clearCookie(
        "crm_refresh_token",
        {
            ...cookieOptions,
            path: "/",
        }
    );

    return res.status(200).json({
        message: "Logged out successfully",
    });
};

export const getMe = async (
    req: Request,
    res: Response
) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access token required",
            });
        }

        const [scheme, token] =
            authHeader.split(" ");

        if (
            scheme !== "Bearer" ||
            !token
        ) {
            return res.status(401).json({
                message:
                    "Invalid authorization header",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as {
            id: string;
            email?: string;
            type: "access";
        };

        if (decoded.type !== "access") {
            return res.status(401).json({
                message:
                    "Invalid access token",
            });
        }

        // Get latest user data from database
        const user =
            await AuthService.findUserById(
                decoded.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Authenticated",

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {

        if (
            error instanceof
            jwt.TokenExpiredError
        ) {
            return res.status(401).json({
                message:
                    "Access token expired",
            });
        }

        if (
            error instanceof
            jwt.JsonWebTokenError
        ) {
            return res.status(401).json({
                message:
                    "Invalid access token",
            });
        }

        console.error(
            "Get current user error:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response
) => {
    try {
        const refreshToken =
            req.cookies?.crm_refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as {
            id: string;
            type: string;
        };

        if (decoded.type !== "refresh") {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        const accessToken = jwt.sign(
            {
                id: decoded.id,
                type: "access",
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        return res.status(200).json({
            accessToken,
        });

    } catch (error) {

        if (
            error instanceof jwt.TokenExpiredError
        ) {
            return res.status(401).json({
                message: "Refresh token expired. Please login again.",
            });
        }

        return res.status(401).json({
            message: "Invalid refresh token",
        });
    }
};

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await AuthService.sendOtp(email);
        if (!user) {
            return res.status(400).json({ message: "User with this email number does not exist" });
        }
    } catch (error) {
        console.log('Error sending otp', error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const user = await AuthService.verifyOtp(email, otp);
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        res.status(200).json({
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.log('Error verifying OTP', error);
        res.status(500).json({ message: "Internal server error" });
    }
}