import { rtdb, db as firestoreDb, auth } from '../lib/firebase';
import { realtimeDbService } from '../services/realtimeDbService';

export { rtdb, firestoreDb, auth, realtimeDbService };
export const db = realtimeDbService;
