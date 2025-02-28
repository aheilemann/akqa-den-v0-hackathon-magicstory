"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getStoryDataItem,
  setStoryDataItem,
} from "@/utils/storage/story-creation-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { icons } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  mainThemes: z.string().min(2, {
    message: "Please fill out your main theme.",
  }),
  // subthemes: z.array(z.string()).refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one item.",
  // }),
});

const StoryThemeForm = memo(() => {
  var focusedElement = "";
  const [subThemes, setSubThemes] = useState<string[] | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // defaultValues: {
    //   items: ["Dark", "Fun"],
    // },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!subThemes) {
      return;
    }
    console.log("onSubmit:", data);
    console.log("Subthemes", subThemes);
    toast.success("You submitted the following values:");

    setStoryDataItem("subtheme", subThemes);
    setStoryDataItem("theme", data.mainThemes);

    router.push("/create/choose-character");
  };
  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(focusedElement);
    }
  };

  const getLocalThemes = () => {
    console.log("Get the localstorage maintheme");
    try {
      const localMainTheme = getStoryDataItem("theme") as string;
      if (localMainTheme) {
        form.setValue("mainThemes", localMainTheme);
      }
    } catch (e) {
      console.error("Error getting subthemes from local storage:", e);
    }

    console.log("Get the localstorage subthemes");
    try {
      const localSubthemes = getStoryDataItem("subtheme") as string[];
      if (localSubthemes) {
        setSubThemes(localSubthemes);
      }
    } catch (e) {
      console.error("Error getting subthemes from local storage:", e);
    }
  };

  useEffect(() => {
    if (!subThemes || !form.getValues("mainThemes")) {
      getLocalThemes();
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
          name="mainThemes"
          render={({ field }) => (
            <FormItem>
              <div>
                <h4 className="text-xl mb-6 mt-8">
                  What should be your main theme?
                </h4>
              </div>
              <FormControl>
                <Textarea
                  className="shadow-md rounded min-h-20 w-full"
                  spellCheck={true}
                  onFocus={() => {
                    focusedElement = "textarea";
                  }}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/*
         * Sub Theme Selection
         */}
        <div>
          <h4 className="text-xl mb-6 mt-8">
            Select the sub themes of your story
          </h4>
        </div>

        <Input
          placeholder="Sub themes..."
          onFocus={(focusEvent) => {
            focusedElement = "input";
          }}
          required={false}
          onKeyUp={(inputEl) => {
            if (inputEl.key === "Enter") {
              inputEl.preventDefault();
              if (!inputEl.currentTarget?.value) return;
              if (
                !subThemes?.includes(inputEl.currentTarget?.value) &&
                inputEl.currentTarget?.value
              ) {
                const inputValue = inputEl.currentTarget.value;
                setSubThemes((prev) =>
                  prev ? [inputValue, ...prev] : [inputValue],
                );
                inputEl.currentTarget.value = "";
              }
            }
          }}
        />
        <div className="flex flex-row flex-wrap max-w-md w-full gap-x-2 my-2">
          {subThemes &&
            subThemes !== null &&
            subThemes.map((subTheme, index) => (
              <div
                key={index}
                className={clsx(
                  "flex flex-row justify-center items-center rounded-full px-4 py-2 gap-1 w-fit cursor-pointer bg-pink-200 mb-2",
                )}
                onClick={() => {
                  const subThemeToRemove = subThemes.find(
                    (val) => val === subTheme,
                  );

                  setSubThemes(
                    (prev) =>
                      prev && prev.filter((val) => val !== subThemeToRemove),
                  );
                }}
                onFocus={() => {
                  focusedElement = "input";
                }}
              >
                <Label
                  defaultValue={subTheme}
                  key={subTheme}
                  className="text-sm"
                >
                  {subTheme}
                </Label>

                <icons.X key="icon" size={12} />
              </div>
            ))}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
});

export { StoryThemeForm, FormSchema };
