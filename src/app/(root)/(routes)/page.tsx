import { Categories } from "@/components/categories";
import Companions from "@/components/companions";
import SearchInput from "@/components/search-input"
import prismadb from "@/lib/prismadb"

interface RootPageProps {
	searchParams: {
		categoryId: string;
		name: string;
	}
}

async function RootPage ({
	searchParams: {
		categoryId,
		name
	}
}: RootPageProps) {

	const data = await prismadb.companion.findMany({
		where: {
			categoryId,
			// name: {
			// 	contains: `%${name}%`
			// }
		},
		orderBy: {
			createdAt: "desc"
		},
		include: {
			_count: {
				select: {
					messages: true
				}
			}
		}
	})

	const categories = await prismadb.category.findMany();

	return (
		<div className="h-full p-4 space-y-2">
			<SearchInput />
			<Categories items={categories} />
			<Companions data={data} />
		</div>
	)
}

export default RootPage