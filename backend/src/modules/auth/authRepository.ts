import userModel from "../../models/userModels";
import otpModel from "../../models/otpModel";

export const findUserByEmailOrMobile = async (email: string, mobile: string) => {
    return await userModel.findOne({
        $or: [{ email }, { mobile }]
    });
};

export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    password: string
) => {
    const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        mobile,
        password
    });

    return newUser;
};


export const findUserByIdentifier = async (identifier: string) => {
    const user = await userModel.findOne({
        $or: [
            { email: identifier },
            { mobile: identifier }
        ]
    });

    return user;
    console.log("User found:", user);
};

export const findUserById = async (id: string) => {
    const user = await userModel.findById(id);
    return user;
}

export const verifyOtp = async (email: string, otp: string) => {
    const otpRecord = await otpModel.findOne({ email, otp });
    if (!otpRecord) {
        throw new Error("Invalid OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
        throw new Error("OTP has expired");
    }
    return otpRecord;
};