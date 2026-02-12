import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Create User Tool
 * Creates a new user in the system
 */
@Injectable()
export class CreateUserTool {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Tool({
        name: 'create-user',
        description: 'Create a new user in the system with required information. Profile image will be set to default avatar.',
        parameters: z.object({
            firstName: z.string().min(2).describe('User\'s first name (minimum 2 characters)'),
            lastName: z.string().min(2).describe('User\'s last name (minimum 2 characters)'),
            email: z.string().email().describe('User\'s email address'),
            username: z.string().min(3).describe('Unique username (minimum 3 characters)'),
            password: z.string().min(6).describe('User\'s password (minimum 6 characters)'),
            phone: z.string().optional().describe('User\'s phone number'),
            countryId: z.number().optional().describe('Country ID'),
        }),
    })
    async createUser({
        firstName,
        lastName,
        email,
        username,
        password,
        phone,
        countryId,
    }: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        phone?: string;
        countryId?: number;
    }) {
        try {
            // Check if user with email already exists
            const existingEmail = await this.userRepository.findOne({
                where: { email },
            });

            if (existingEmail) {
                return {
                    success: false,
                    error: `User with email "${email}" already exists`,
                };
            }

            // Check if user with username already exists
            const existingUsername = await this.userRepository.findOne({
                where: { username },
            });

            if (existingUsername) {
                return {
                    success: false,
                    error: `User with username "${username}" already exists`,
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user with default profile image
            const newUser = this.userRepository.create({
                first_name: firstName,
                last_name: lastName,
                email,
                username,
                password: hashedPassword,
                phone: phone || null,
                country_id: countryId || null,
                profile_picture: '/assets/images/avatar/person/person.png',
            });

            const savedUser = await this.userRepository.save(newUser);

            return {
                success: true,
                message: `User "${firstName} ${lastName}" has been successfully created`,
                user: {
                    id: savedUser.id,
                    name: `${savedUser.first_name} ${savedUser.last_name}`,
                    email: savedUser.email,
                    username: savedUser.username,
                    phone: savedUser.phone,
                    profilePicture: savedUser.profile_picture,
                    createdAt: savedUser.created_at,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
