export interface User {
  id?: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface UserPassword {
  oldPassword: string;
  newPassword: string;
}
