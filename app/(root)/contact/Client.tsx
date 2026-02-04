"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { sanityClient } from "@/lib/sanity"
import { sendContactEmail } from "@/lib/actions"


// This component handles the submit button state
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  )
}

// Initial state for the form
type ContactFormErrors = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

type ContactFormState = {
  success: boolean
  message: string
  errors: ContactFormErrors
}

const initialState: ContactFormState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactClient() {
  // Use React's useFormState hook to manage form state with the server action
  const [state, setState] = useState(initialState)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = await sendContactEmail(formData)
    // Normalize result to always match ContactFormState
    setState({
      success: result.success ?? false,
      message: result.message ?? "",
      errors: result.errors ?? {}
    })
  }
  
 

  return (
    <div>
              {/* Show success message if form was submitted successfully */}
              {state.success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                  {state.message}
                </div>
              )}
    
              {/* Show error message if form submission failed */}
              {!state.success && state.message && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{state.message}</div>
              )}
    
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                  {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>}
                </div>
    
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                  {state.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>}
                </div>
    
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                  />
                  {state.errors?.subject && <p className="mt-1 text-sm text-red-600">{state.errors.subject}</p>}
                </div>
    
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                  ></textarea>
                  {state.errors?.message && <p className="mt-1 text-sm text-red-600">{state.errors.message}</p>}
                </div>
    
                <div>
                  <SubmitButton />
                </div>
              </form>
            </div>
  )
}
