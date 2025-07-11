import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "./input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
    feedbackType: z.enum(['feedback', 'missing item']),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
    feedbackText: z.string().optional(),
    itemName: z.string().optional(),
    url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.feedbackType === 'feedback') {
        if (!data.feedbackText || data.feedbackText.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['feedbackText'],
                message: 'Feedback must be at least 10 characters.',
            });
        }
    } else if (data.feedbackType === 'missing item') {
        if (!data.itemName || data.itemName.trim().length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['itemName'],
                message: 'Item name is required.',
            });
        }
        if (!data.url || !/^https:\/\/wiki\.warframe\.com\/.*/.test(data.url)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['url'],
                message: 'Please provide a valid Warframe Wiki URL.',
            });
        }
    }
});

type FormData = z.infer<typeof formSchema>;

export function Feedback() {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            feedbackType: 'missing item',
            email: '',
            feedbackText: '',
            itemName: '',
            url: '',
        },
    });

    const feedbackType = watch("feedbackType");

    const onSubmit = (data: FormData) => {
        // Submission logic not implemented as requested
        if(data.feedbackType === 'feedback') {
            console.log("Feedback submitted:", data.feedbackText, data.email);
        }
        else if(data.feedbackType === 'missing item') {
            console.log("Missing item reported:", data.itemName, data.url);
        }
        setIsOpen(false); // Close popover on submission
      };

      return (
        <div className="fixed bottom-4 right-4 z-50">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button>Feedback</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Provide Feedback</h4>
                    <p className="text-sm text-muted-foreground">
                      Your feedback is valuable to us.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <RadioGroup
                      defaultValue="missing item"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value: "feedback" | "missing item") =>
                        setValue("feedbackType", value, { shouldValidate: true })
                      }
                    >
                      <div>
                        <RadioGroupItem
                          value="feedback"
                          id="feedback"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="feedback"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          Feedback
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="missing item"
                          id="missing-item"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="missing-item"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          Missing Item
                        </Label>
                      </div>
                    </RadioGroup>
      
                    {feedbackType === 'feedback' && (
                      <>
                      <Input
                        type="email"
                        placeholder="Email (optional)"
                        {...register("email")}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                      <Textarea
                        placeholder="Please provide your feedback..."
                        {...register("feedbackText")}
                      />
                      {errors.feedbackText && <p className="text-xs text-red-500">{errors.feedbackText.message}</p>}
                      </>
                    )}

                    {feedbackType === 'missing item' && (
                      <>
                        <Input
                          type="text"
                          placeholder="Item Name"
                          {...register("itemName")}
                        />
                        {errors.itemName && <p className="text-xs text-red-500">{errors.itemName.message}</p>}
                        <Input
                          type="url"
                          placeholder="https://wiki.warframe.com/..."
                          {...register("url")}
                        />
                        {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
                      </>
                    )}

                    <Button type="submit">Submit</Button>
                  </div>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      );
}