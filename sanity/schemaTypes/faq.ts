import { defineField, defineType } from "sanity"

export const faqType = defineType({
  name: "faq",
  title: "FAQ Page",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      description: "The frequently asked question.",
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      description: "The answer to the question.",
    }),
  ],
})
