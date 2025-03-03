"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  getStoryDataItem,
  setStoryDataItem,
} from "@/utils/storage/story-creation-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  type: z.string().min(2, {
    message: "Please select your story type.",
  }),
});

const StoryTypeForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setStoryDataItem("type", data.type);
    router.replace("/create/your-story");
  };

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const getLocalCharacter = () => {
    try {
      const localCharacter = getStoryDataItem("type") as string;
      if (localCharacter) {
        form.setValue("type", localCharacter);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!form.getValues("type")) {
      getLocalCharacter();
    }
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        onKeyDown={(e) => checkKeyDown(e)}
        onError={() => {
          console.log("error");
        }}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <div>
                <h4 className="text-xl mb-6 mt-8 text-wrap max-w-80">
                  What should be your story type?
                </h4>
              </div>
              <FormControl>
                <Textarea
                  className="shadow-md rounded min-h-20 w-full"
                  spellCheck={true}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export { StoryTypeForm };
