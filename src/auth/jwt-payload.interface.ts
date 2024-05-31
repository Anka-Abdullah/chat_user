export interface JwtPayload {
    email: string;
    sub: string; // This should correspond to the user's ID
  }
  