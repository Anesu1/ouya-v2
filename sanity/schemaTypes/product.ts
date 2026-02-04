import { defineField, defineType } from "sanity"

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "handle",
      title: "Handle",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price",
      type: "number",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "variants",
      title: "Variants",
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
              name: "price",
              title: "Price",
              type: "number",
            }),
            defineField({
              name: "compareAtPrice",
              title: "Compare at Price",
              type: "number",
            }),
            defineField({
              name: "weight",
              title: "Weight (g)",
              type: "number",
            }),
            defineField({
              name: "inStock",
              title: "In Stock",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "collection" }],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "vendor",
      title: "Vendor",
      type: "string",
      initialValue: "Ouya Oenda",
    }),
    defineField({
      name: "fragranceNotes",
      title: "Fragrance Notes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    // New fields for enhanced product details
    defineField({
      name: "burnTime",
      title: "Burn Time",
      type: "string",
      description: "e.g., 'Approximately 30-35 hours'",
    }),
    defineField({
      name: "productDetails",
      title: "Product Details",
      type: "text",
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "string",
      description: "e.g., '100% natural soy wax, premium fragrance oils, cotton wick'",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions/Container",
      type: "string",
      description: "e.g., 'Black glass jar with cork lid'",
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "text",
      description: "Instructions for product care",
    }),
    defineField({
      name: "shippingInfo",
      title: "Shipping Info",
      type: "text",
      description: "Instructions for product care",
    }),
    defineField({
      name: "sustainability",
      title: "Sustainability Badge",
      type: "string",
      description: "Text for sustainability badge, if applicable",
    }),
    defineField({
      name: "deliveryMessage",
      title: "Delivery Message",
      type: "string",
      description: "e.g., 'Free delivery by Apr 16 - Apr 17'",
    }),
    defineField({
      name: "deliverySubtext",
      title: "Delivery Subtext",
      type: "string",
      description: "e.g., 'Express delivery available'",
    }),
    defineField({
      name: "returnsMessage",
      title: "Returns Message",
      type: "string",
      description: "e.g., 'Free 30-day returns'",
    }),
    defineField({
      name: "returnsSubtext",
      title: "Returns Subtext",
      type: "string",
      description: "e.g., '1-year warranty'",
    }),
  ],
})
