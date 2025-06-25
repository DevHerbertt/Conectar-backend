export interface JwtPayload {
  email: string;
  id: number; 
  role: 'admin' | 'user';
}