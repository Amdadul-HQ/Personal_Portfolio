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
// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  message: z.string().min(1, { message: "Message is required" }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const whatsAppNumber = "01756171239" // Replace with your actual WhatsApp number

  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      message: "",
    },
  })

  // Form submission handler
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form submitted:", data)
      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
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
        <div className="bg-green-900/20 p-6 rounded-lg text-center">
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
                        className="border-gray-700 text-white h-12 rounded-md focus:border-gray-500"
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
                        placeholder="Phone Number"
                        {...field}
                        className="border-gray-700 text-white h-12 rounded-md focus:border-gray-500"
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
                      className="border-gray-700 text-white min-h-[160px] rounded-md focus:border-gray-500"
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
              <WhatsAppButton phoneNumber="1234567890" /> {/* Replace with your actual WhatsApp number */}
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
