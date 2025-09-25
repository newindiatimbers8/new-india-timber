import type { UserAccount } from '@/types/auth';

export const usersData: UserAccount[] = [
  {
    "id": "admin-001",
    "email": "admin@newindiatimber.com",
    "name": "Admin User",
    "password": "$2a$10$timber2024salt$ccbdd5af9f17547939adf150b8b8fc6da6b0361f859f2982634e4494ac3453a5", // "admin123"
    "role": "Admin",
    "status": "active",
    "permissions": ["products", "blog", "orders", "seo", "users"],
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "isActive": true
  }
];

export default usersData;
