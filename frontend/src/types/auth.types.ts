export interface AuthUser {
  id: string;
  email: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: AuthUser;
}

export interface MeResponse {
  message: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}