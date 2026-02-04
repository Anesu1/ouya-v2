import { defineField, defineType } from "sanity"

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroCarousel",
      title: "Hero Carousel",
      type: "array",
      of: [
        {
          type: "object",
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
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "brandStatement",
      title: "Brand Statement",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
      ],
    }),
    defineField({
      name: "featuredStatement",
      title: "Featured Statement",
      type: "object",
      fields: [
        {
          name: "heading",
          title: "Heading",
          type: "string",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
        },
      ],
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    }),
    defineField({
      name: "perfectScent",
      title: "Perfect Scent",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
        }),
        defineField({
          name: "scents",
          title: "Scents",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Name",
                  type: "string",
                }),
                defineField({
                  name: "link",
                  title: "Link",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
})
