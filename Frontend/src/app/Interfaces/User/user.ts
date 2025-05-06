// For registration payload
export interface RegisterUser {
    userName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    password: string;
    confirmPassword: string;
  }

  export interface GetUser {
    userName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
  }

  
  // For login payload
  export interface LoginUser {
    email: string;
    password: string;
  }
  
  // For API response
  export interface AuthResponse {
    status: number;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      userName: string;
      email: string;
    };
    expiresIn?: number;
  }
  
  // For stored user data (without sensitive info)
  export interface UserProfile {
    id: string;
    userName: string;
    email: string;
  }