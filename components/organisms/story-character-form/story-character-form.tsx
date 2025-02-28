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
import { get } from "http";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  character: z.string().min(2, {
    message: "Please fill out your character.",
  }),
  // subthemes: z.array(z.string()).refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one item.",
  // }),
});

const StoryCharacterForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // defaultValues: {
    //   items: ["Dark", "Fun"],
    // },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("onSubmit:", data);
    toast.success("You submitted the following values:");

    setStoryDataItem("character", data.character);
    router.push("/create/choose-type");
  };

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const getLocalCharacter = () => {
    try {
      const localCharacter = getStoryDataItem("character") as string;
      if (localCharacter) {
        form.setValue("character", localCharacter);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!form.getValues("character")) {
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
          name="character"
          render={({ field }) => (
            <FormItem>
              <div>
                <h4 className="text-xl mb-6 mt-8 text-wrap max-w-80">
                  What should be your character(s)? How do your character(s)
                  act?
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

export { StoryCharacterForm };
