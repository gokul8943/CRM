import type { Request, Response } from "express";
import * as AuthService from "./authServices"


export const signup = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, mobile, password } = req.body;

        if ( !email || !mobile || !password) {
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


export const login = async (req: Request, res: Response) => {
    try {

        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const result = await AuthService.loginUser(identifier, password);

        // Set httpOnly cookie with JWT token (1 day expiry)
        res.cookie("crm_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: result.user,
            token: result.token,
        });

    } catch (error: any) {

        if (error.message === "User not found") {
            return res.status(400).json({ message: "Invalid username/email/mobile" });
        }

        if (error.message === "Invalid password") {
            return res.status(400).json({ message: "Invalid password" });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("crm_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.crm_token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET as string) as any;
        return res.status(200).json({
            message: "Authenticated",
            user: { id: decoded.id, email: decoded.email },
        });
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
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