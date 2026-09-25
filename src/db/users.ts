import { realtimeDbService } from '../services/realtimeDbService';
import { User } from '../types';

export async function getOrCreateUser(uid: string, email: string, fullName?: string): Promise<Partial<User>> {
  return await realtimeDbService.getOrCreateUser(uid, email, fullName);
}

export async function getAllUsersFromDb(): Promise<User[]> {
  return await realtimeDbService.getAllUsers();
}
