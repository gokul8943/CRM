import { Router } from "express";
import { login, logout, getMe, sendOtp, signup, verifyOtp, refreshAccessToken } from "./authController";


const router = Router();

/**
 * @swagger
 * /api/auth/v1/signup:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Invalid credentials
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/v1/login:
 *   post:
 *     summary: User Login
 *     description: Login using username, email, or mobile with password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: johndoe@gmail.com
 *                 description: Username, Email, or Mobile number
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 user:
 *                   type: object
 *                   example:
 *                     _id: 65df6c8a123456789abc1234
 *                     username: johndoe
 *                     email: johndoe@gmail.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid username/email/mobile
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/v1/send-otp:
 *   post:
 *     summary: Send OTP to user email
 *     description: Sends a one-time password (OTP) to the user's registered email for verification or password reset.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@gmail.com
 *                 description: Registered user email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: OTP sent successfully
 *       400:
 *         description: Bad request (email missing or user not found)
 *         content:
 *           application/json:
 *             examples:
 *               emailMissing:
 *                 summary: Email not provided
 *                 value:
 *                   message: Email is required
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   message: User with this email number does not exist
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post("/send-otp", sendOtp)

/**
 * @swagger
 * /api/auth/v1/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to the user's email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@gmail.com
 *                 description: Registered user email
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: OTP received in email
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             example:
 *               message: OTP verified successfully
 *       400:
 *         description: Invalid request or user not found
 *         content:
 *           application/json:
 *             examples:
 *               missingFields:
 *                 summary: Email or OTP missing
 *                 value:
 *                   message: Email and OTP are required
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   message: User with this email does not exist
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/verify-otp', verifyOtp)

router.post('/logout', logout)
router.get('/me', getMe)
router.post(
    "/refresh",
    refreshAccessToken
);

export default router;
