import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/Auth";
import * as userService from "./userService";


export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        const userId = user?.id;

        if (!userId) {
            return res.status(404).json({ message: "user not authenticated" });
        }

        const profile = await userService.getProfile(userId);
        res.status(200).json({
            message: "User profile retrieved successfully",
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user profile",
            error
        });
    }
}


export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const userId = user?.id;
        if (!userId) {
            return res.status(404).json({ message: "user not authenticated" });
        }
        const data = req.body;
        const updatedProfile = await userService.updateProfile(userId, data);
        res.status(200).json({
            message: "User profile updated successfully",
            data: updatedProfile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user profile",
            error
        });
    }
}



