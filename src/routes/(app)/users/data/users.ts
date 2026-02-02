import { faker } from '@faker-js/faker';
import type { User } from './schema.js';

faker.seed(7);

export const users: User[] = Array.from({ length: 100 }, () => {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	return {
		id: faker.string.uuid(),
		firstName,
		lastName,
		username: faker.internet.username({ firstName, lastName }).toLowerCase(),
		email: faker.internet.email({ firstName }).toLowerCase(),
		phoneNumber: faker.phone.number({ style: 'international' }),
		status: faker.helpers.arrayElement([
			'active' as const,
			'inactive' as const,
			'invited' as const,
			'suspended' as const
		]),
		role: faker.helpers.arrayElement([
			'superadmin' as const,
			'admin' as const,
			'cashier' as const,
			'manager' as const
		]),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent()
	};
});
