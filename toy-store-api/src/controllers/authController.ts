import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { createUserSchema, loginSchema } from '../types';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.userService.login(validatedData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }
} 