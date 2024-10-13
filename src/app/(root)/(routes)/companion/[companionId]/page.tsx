import prismadb from '@/lib/prismadb';
import CompanionForm from './companion-form';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
interface CompanionPageProps {
	params: {
		companionId: string;
	}
}

async function CompanionPage ({ params }: CompanionPageProps) {

	// TODO: Check Subscription

	const { userId } = auth();

	if (!userId) {
		return redirect('/sign-in');
	}

	const companion = await prismadb.companion.findUnique({
		where: {
			id: params.companionId,
			userId
		}
	});
	
	const categories = await prismadb.category.findMany();

	return (		
		<CompanionForm initialData={companion} categories={categories} />		
	)
}

export default CompanionPage;