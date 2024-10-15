'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface SubscriptionButtonProps {
	isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {

	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const onClick = async () => {
		try {
			setLoading(true);

			const response = await axios.get("/api/stripe");

		} catch (error) {			
			toast({
				title: "Something went wrong",
				description: "Please try again.",
				variant: "destructive"
			})
		} finally {
			setLoading(false);
		}
	}

	return (
		<Button disabled={loading} onClick={onClick} size="sm" variant={isPro ? "default" : "premium"}>
			{isPro ? "Manage Subscription" : "Upgrade"}
			{!isPro && <Sparkles className="w-4 h-4 ml-2 fill-white" />}
		</Button>
	)
}