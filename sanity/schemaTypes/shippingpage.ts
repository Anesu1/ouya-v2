import { defineField, defineType } from "sanity"

export const shippingInfoType = defineType({
  name: "shippingInfo",
  title: "Shipping Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the Shipping Information page.",
    }),
    defineField({
      name: "domesticShipping",
      title: "Domestic Shipping",
      type: "text",
      description: "Details about domestic shipping policies.",
    }),
    defineField({
      name: "domesticRates",
      title: "Domestic Rates",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "method", type: "string", title: "Shipping Method" },
            {
              name: "deliveryTime",
              type: "string",
              title: "Estimated Delivery",
            },
            { name: "cost", type: "string", title: "Cost" },
          ],
        },
      ],
    }),
    defineField({
      name: "internationalShipping",
      title: "International Shipping",
      type: "text",
      description: "Details about international shipping policies.",
    }),
    defineField({
      name: "orderProcessing",
      title: "Order Processing",
      type: "text",
      description: "Details about order processing times.",
    }),
    defineField({
      name: "trackingInfo",
      title: "Tracking Information",
      type: "text",
      description: "Details about tracking orders.",
    }),
    defineField({
      name: "shippingRestrictions",
      title: "Shipping Restrictions",
      type: "text",
      description: "Details about shipping restrictions.",
    }),
  ],
})
