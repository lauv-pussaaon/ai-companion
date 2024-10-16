'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Companion } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/image-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { PREAMBLE, SEED_CHAT, BACKGROUND } from '@/scripts/companions/default';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
interface CompanionFormProps {
	initialData: Companion | null;
	categories: Category[];
}

const formSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	instructions: z.string().min(200, { message: 'Instructions require at least 200 characters' }),
	seed: z.string().min(200, { message: 'Seed require at least 200 characters' }),
	src: z.string().min(1, { message: 'Image is required' }),
	categoryId: z.string().min(1, { message: 'Category is required' })
});

function CompanionForm ({ initialData, categories }: CompanionFormProps) {

	const router = useRouter();
	const { toast } = useToast();
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			description: '',
			instructions: '',
			seed: '',
			src: '',
			categoryId: undefined
		}
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (initialData) {
				await axios.patch(`/api/companion/${initialData.id}`, values);
			} else {
				await axios.post('/api/companion', values);
			}
			toast({
				description: 'Success.'
			})

			router.refresh();
			router.push("/");
		} catch (error) {
			toast({
				variant: 'destructive',
				description: 'Something went wrong. Please try again.'				
			})
		}
	}

	return (
		<div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
					<div className="space-y-2 w-full">
						<div>
							<h3 className="text-lg font-medium">
								General Information
							</h3>
							<p className="text-sm text-muted-foreground">
								General information about your Companion
							</p>
						</div>
						<Separator className="bg-primary/10" />
					</div>
					<FormField
						name="src"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center justify-center space-y-4">
								<FormControl>
									<ImageUpload
										disabled={isLoading}
										onChange={field.onChange}
										value={field.value}
									/>									
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem className="col-span-2 md:col-span-1">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input 
											disabled={isLoading}
											placeholder="Elon Musk" 
											className="bg-background"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is how your AI Companion will be named.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem className="col-span-2 md:col-span-1">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input 
											disabled={isLoading}
											placeholder="CEO & Founder of Tesla, SpaceX" 
											className="bg-background"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Describe your AI Companion in a few sentences.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="categoryId"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										disabled={isLoading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="bg-background">
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem 
													key={category.id} 
													value={category.id}
												>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Select the category that best describes your AI Companion.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-2 w-full">
						<div>
							<h3 className="text-lg font-medium">
								Configuration
							</h3>
							<p className="text-sm text-muted-foreground">
								Detailed instructions for AI Behavior
							</p>
						</div>
						<Separator className="bg-primary/10" />
					</div>
					<FormField
							name="instructions"
							control={form.control}
							render={({ field }) => (
								<FormItem className="col-span-2 md:col-span-1">
									<FormLabel>Instructions</FormLabel>
									<FormControl>
										<Textarea 
											disabled={isLoading}
											placeholder={PREAMBLE}
											className="bg-background resize-none"
											rows={7}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Describe in detail your companions &apos;s backstory and relevant details.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="seed"
							control={form.control}
							render={({ field }) => (
								<FormItem className="col-span-2 md:col-span-1">
									<FormLabel>Example Conversation</FormLabel>
									<FormControl>
										<Textarea 
											disabled={isLoading}
											placeholder={SEED_CHAT}
											className="bg-background resize-none"
											rows={7}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Example conversation between you and your AI Companion.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="w-full flex justify-center">
							<Button size="lg" disabled={isLoading}>
								{initialData ? "Edit your companion" : "Create your companion"}
								<Wand2 className="w-4 h-4 ml-2" />
							</Button>
						</div>
				</form>
			</Form>
		</div>
	)
}

export default CompanionForm;