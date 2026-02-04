import { defineField, defineType } from "sanity"

export const contactUsType = defineType({
  name: "contactUs",
  title: "Contact Us Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the Contact Us page.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "The main text content for the Contact Us page.",
    }),

    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      description: "The email address displayed on the Contact Us page.",
    }),
  ],
})
