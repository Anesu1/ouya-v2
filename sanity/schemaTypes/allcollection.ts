import { defineField, defineType } from "sanity"

export const allCollectionType = defineType({
  name: "allCollection",
  title: "All Collections Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",

      type: "text",
    }),
  ],
})
