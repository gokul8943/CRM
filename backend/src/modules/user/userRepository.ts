import userModel from "../../models/userModels";

export const getProfile = async (userId: string) => {
    try {
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        throw new Error("Failed to retrieve user profile");
    }
}


export const updateProfile = async (userId: string, data: any) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, data, { new: true }).select("-password");
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error("Failed to update user profile");
    }
}

