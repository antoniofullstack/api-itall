import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppDataSource } from '../config/ormconfig';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../config/constants';
import { RegisterUserDTO, AuthCredentialsDTO, AuthResponseDTO } from '../types';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(data: RegisterUserDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_IN_USE, 400);
    }

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async login(credentials: AuthCredentialsDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
      select: ['id', 'name', 'email', 'password']
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const isValidPassword = await user.comparePassword(credentials.password);
    if (!isValidPassword) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const token = this.generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1d'
    });
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
      if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }
      return user;
    } catch (error) {
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);
    }
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }
    return user;
  }
}
