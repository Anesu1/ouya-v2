import { defineField, defineType } from "sanity"

export const shippingZoneType = defineType({
  name: "shippingZone",
  title: "Shipping Zone",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Zone Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "countries",
      title: "Countries",
      type: "array",
      of: [{ type: "string" }],
      description: "List of country codes (e.g., GB, US, CA) included in this zone",
    }),
    defineField({
      name: "isDefault",
      title: "Default Zone",
      type: "boolean",
      description: "Set this as the default zone for countries not explicitly listed in other zones",
      initialValue: false,
    }),
  ],
})

export const shippingMethodType = defineType({
  name: "shippingMethod",
  title: "Shipping Method",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Method Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "carrier",
      title: "Carrier",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Truck", value: "Truck" },
          { title: "Plane", value: "Plane" },
          { title: "Box", value: "Box" },
        ],
      },
    }),
    defineField({
      name: "logo",
      title: "Carrier Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "zone",
      title: "Shipping Zone",
      type: "reference",
      to: [{ type: "shippingZone" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "basePrice",
      title: "Base Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "freeShippingThreshold",
      title: "Free Shipping Threshold",
      type: "number",
      description: "Order subtotal amount above which shipping is free (0 for no free shipping)",
      initialValue: 0,
    }),
    defineField({
      name: "estimatedDelivery",
      title: "Estimated Delivery Time",
      type: "string",
      description: "e.g., '2-3 business days'",
    }),
    defineField({
      name: "weightSurcharges",
      title: "Weight Surcharges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "minWeight", title: "Minimum Weight (g)", type: "number" },
            { name: "maxWeight", title: "Maximum Weight (g)", type: "number" },
            { name: "surcharge", title: "Additional Cost", type: "number" },
          ],
        },
      ],
      description: "Additional charges based on package weight",
    }),
  ],
})
