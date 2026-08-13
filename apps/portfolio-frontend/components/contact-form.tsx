"use client"

import { useState } from "react"
import WhatsAppButton from "./whatsapp-button"
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@workspace/ui/components/form";
import {Input} from "@workspace/ui/components/input";
import {Textarea} from "@workspace/ui/components/textarea";
import { toast } from "sonner";
// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  message: z.string().min(1, { message: "Message is required" }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  // Form submission handler
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          contact: data.phone ? `${data.email} / ${data.phone}` : data.email,
          message: data.message,
        }),
      })
      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.success) {
        toast.error(result?.message || "Failed to send your message. Please try again.")
        return
      }
      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to send your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-medium text-white">
          Thanks for taking the time to reach out. How can I help you today?
        </h1>
      </div>

      {isSuccess ? (
        <div className="bg-green-900/20 dark:bg-green-500/10 dark:border dark:border-green-500/20 p-6 rounded-lg text-center">
          <p className="text-green-400 text-lg">Thank you for your message! We'll get back to you soon.</p>
          <Button
            variant="outline"
            className="mt-4 text-white border-white hover:bg-white/10"
            onClick={() => setIsSuccess(false)}
          >
            Send another message
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="border-gray-700 text-white h-12 rounded-md focus:border-gray-500 dark:bg-[#0f1524] dark:border-green-500/20 dark:placeholder:text-gray-400 dark:focus:border-green-500/40"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email address"
                        {...field}
                        className="border-gray-700 text-white h-12 rounded-md focus:border-gray-500 dark:bg-[#0f1524] dark:border-green-500/20 dark:placeholder:text-gray-400 dark:focus:border-green-500/40"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone Number (optional)"
                        {...field}
                        className="border-gray-700 text-white h-12 rounded-md focus:border-gray-500 dark:bg-[#0f1524] dark:border-green-500/20 dark:placeholder:text-gray-400 dark:focus:border-green-500/40"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Message"
                      {...field}
                      className="border-gray-700 text-white min-h-[160px] rounded-md focus:border-gray-500 dark:bg-[#0f1524] dark:border-green-500/20 dark:placeholder:text-gray-400 dark:focus:border-green-500/40"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-transparent hover:bg-white/10 text-white border border-white rounded-full px-8"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
              <WhatsAppButton phoneNumber="01756171239" />
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
