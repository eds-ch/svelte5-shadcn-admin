import { z } from 'zod';
import { m } from '$lib/paraglide/messages.js';

const userStatusSchema = z.union([
	z.literal('active'),
	z.literal('inactive'),
	z.literal('invited'),
	z.literal('suspended')
]);
export type UserStatus = z.infer<typeof userStatusSchema>;

const userRoleSchema = z.union([
	z.literal('superadmin'),
	z.literal('admin'),
	z.literal('cashier'),
	z.literal('manager')
]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	username: z.string(),
	email: z.string(),
	phoneNumber: z.string(),
	status: userStatusSchema,
	role: userRoleSchema,
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});
export type User = z.infer<typeof userSchema>;

export function getUserFormSchema() {
	return z.object({
		firstName: z.string().min(1, m.validation_first_name_required()),
		lastName: z.string().min(1, m.validation_last_name_required()),
		username: z.string().min(1, m.validation_username_required()),
		email: z.string().email(m.validation_email_address()),
		phoneNumber: z.string().min(1, m.validation_phone_required()),
		role: userRoleSchema,
		status: userStatusSchema
	});
}

export function getUserInviteFormSchema() {
	return z.object({
		email: z.string().email(m.validation_email_address()),
		role: userRoleSchema,
		description: z.string().optional()
	});
}
