
import * as userRepository from "./userRepository";

export const getProfile = async (userId: string) => {
    const profile = await userRepository.getProfile(userId);
    return profile;
}

export const updateProfile = async (userId: string, data: any) => {
    const updatedProfile = await userRepository.updateProfile(userId, data);
    return updatedProfile;
}

