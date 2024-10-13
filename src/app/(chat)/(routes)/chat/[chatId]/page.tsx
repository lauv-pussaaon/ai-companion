import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/ChatClient";

interface ChatPageProps {
	params: {
		chatId: string
	}
}


async function ChatPage ({
	params
}: ChatPageProps) {

	const { userId} = auth();

	if (!userId) {
		return {
			redirect: {
				destination: '/sign-in',
				permanent: false,
			},
		};
	}

	const companion = await prismadb.companion.findUnique({
		where: {
			id: params.chatId
		},
		include: {
			messages: {
				orderBy: {
					createdAt: 'asc'
				},
				where: {
					userId
				},				
			},
			_count: {
				select: {
					messages: true
				}
			}
		}
	});

	if (!companion) {
		return redirect('/');
	}

	return (
		<ChatClient companion={companion} />
	)
}

export default ChatPage 
