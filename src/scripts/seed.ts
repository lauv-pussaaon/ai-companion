const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main () {
	try {
		await db.category.createMany({
			data: [
				{ name: 'Design Patterns' },
				{ name: 'Software Architecture' },
				{ name: 'Software Development' },
				{ name: 'Software Testing' },
				{ name: 'Software Project Management' }
			]
		})
	} catch (error) {
		console.log('Error sending default categories to db', error);
	} finally {
		await db.$disconnect();
	}
}

main();