import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../auth/enums/role.enum'; // Ensure Role enum is imported

// Define User structure for in-memory store
export interface User {
  _id: string; // Use string for UUID
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

// Pre-hash the admin password (use sync for initialization)
const saltRounds = 10;
const adminPasswordHash = bcrypt.hashSync('password123', saltRounds);

@Injectable()
export class UsersService {
  // Initialize in-memory storage with the admin user
  private readonly users: User[] = [
    {
      _id: uuidv4(),
      email: 'admin@test.com',
      passwordHash: adminPasswordHash,
      role: Role.Admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Constructor removed - no model injection needed

  findByEmail(email: string): User | null {
    // Use .find() on the array
    const user = this.users.find((u) => u.email === email);
    // Return the full user object including hash, or null if not found
    return user || null;
  }

  findById(id: string): User | null {
    // Use .find() on the array
    const user = this.users.find((u) => u._id === id);
    // Return a copy without the password hash for safety in general use cases
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...result } = user;
      return result as User;
    }
    return null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existingUser = this.users.find((u) => u.email === email); // Simple find is enough
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password (using async hash here is correct)
    // const saltRounds = 10; // Already defined above, but keep it local for clarity if preferred
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user object
    const newUser: User = {
      _id: uuidv4(), // Generate UUID
      email,
      passwordHash,
      role: Role.Employee, // Default role for registration
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to in-memory array
    this.users.push(newUser);

    // Return a copy without the password hash for safety
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = newUser;
    return result as User; // Type assertion needed as we removed a property
  }

  // --- Helper for testing or manual admin promotion ---
  // NOTE: This is NOT secure for a real application!
  promoteToAdmin(email: string): User | null {
    const userIndex = this.users.findIndex((u) => u.email === email);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    const user = this.users[userIndex];
    user.role = Role.Admin;
    user.updatedAt = new Date();
    // Update the user in the array (optional but good practice)
    this.users[userIndex] = user;
    // Return a copy without the password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = user;
    return result as User;
  }
}
