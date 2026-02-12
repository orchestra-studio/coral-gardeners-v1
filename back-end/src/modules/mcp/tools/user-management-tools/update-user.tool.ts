import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { UsersService } from '../../../users/users.service';

/**
 * Update User Tool
 * Updates existing user information by user ID
 */
@Injectable()
export class UpdateUserTool {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'update-user',
        description: 'Update an existing user\'s information by their user ID. Use list-users or search-users to find the user ID first. Allows updating name, email, phone, password, profile picture, country, or verification status. Only provide the fields you want to change.',
        parameters: z.object({
            userId: z.number().int().positive().describe('ID of the user to update (get this from list-users or search-users first)'),
            first_name: z.string().optional().describe('New first name'),
            last_name: z.string().optional().describe('New last name'),
            email: z.string().email().optional().describe('New email address'),
            password: z.string().min(6).optional().describe('New password (minimum 6 characters)'),
            phone: z.string().optional().describe('New phone number'),
            profile_picture: z.string().optional().describe('New profile picture URL or path'),
            country_id: z.number().int().positive().optional().describe('New country ID'),
            verified: z.boolean().optional().describe('Set email verification status: true = verified, false = unverified'),
        }),
    })
    async updateUser({
        userId,
        first_name,
        last_name,
        email,
        password,
        phone,
        profile_picture,
        country_id,
        verified,
    }) {
        try {
            // First, get the user by ID to get their username
            const user = await this.userRepository.findOne({
                where: { id: userId },
                select: ['id', 'username', 'first_name', 'last_name', 'email'],
            });

            if (!user) {
                return {
                    success: false,
                    message: `User with ID ${userId} not found. Please use list-users or search-users to find valid user IDs.`,
                };
            }

            // Build update object with only provided fields
            const updateData: any = {};
            if (first_name !== undefined) updateData.first_name = first_name;
            if (last_name !== undefined) updateData.last_name = last_name;
            if (email !== undefined) updateData.email = email;
            if (password !== undefined) updateData.password = password;
            if (phone !== undefined) updateData.phone = phone;
            if (profile_picture !== undefined) updateData.profile_picture = profile_picture;
            if (country_id !== undefined) updateData.country_id = country_id;

            // Handle verification status
            if (verified !== undefined) {
                updateData.email_verified_at = verified ? new Date() : null;
            }

            // Check if any fields to update
            if (Object.keys(updateData).length === 0) {
                return {
                    success: false,
                    message: 'No fields provided to update. Please specify at least one field to change.',
                };
            }

            // Update using the username (required by the service)
            const updatedUser = await this.usersService.update(user.username, updateData);

            const updatedFields = Object.keys(updateData).join(', ');

            return {
                success: true,
                message: `User '${user.username}' (ID: ${userId}) updated successfully. Updated fields: ${updatedFields}`,
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    profile_picture: updatedUser.profile_picture,
                    country_id: updatedUser.country_id,
                    email_verified_at: updatedUser.email_verified_at,
                    created_at: updatedUser.created_at,
                    updated_at: updatedUser.updated_at,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to update user: ${error.message}`,
            };
        }
    }
}
