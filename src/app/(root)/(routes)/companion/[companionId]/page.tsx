import prismadb from '@/lib/prismadb';
import CompanionForm from './companion-form';

interface CompanionPageProps {
	params: {
		companionId: string;
	}
}

async function CompanionPage ({ params }: CompanionPageProps) {

	// TODO: Check Subscription

	const companion = await prismadb.companion.findUnique({
		where: {
			id: params.companionId
		}
	});
	
	const categories = await prismadb.category.findMany();

	return (		
		<CompanionForm initialData={companion} categories={categories} />		
	)
}

export default CompanionPage;