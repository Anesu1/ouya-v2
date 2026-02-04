import { defineField, defineType } from "sanity"

export const returnsType = defineType({
  name: "returns",
  title: "Returns & Exchanges Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the Returns & Exchanges page.",
    }),
    defineField({
      name: "returnPolicy",
      title: "Return Policy",
      type: "text",
      description: "Details about the return policy.",
    }),
    defineField({
      name: "eligibleItems",
      title: "Eligible Items",
      type: "array",
      of: [{ type: "string" }],
      description: "List of items eligible for return.",
    }),
    defineField({
      name: "nonReturnableItems",
      title: "Non-Returnable Items",
      type: "array",
      of: [{ type: "string" }],
      description: "List of items that cannot be returned.",
    }),
    defineField({
      name: "exchangePolicy",
      title: "Exchange Policy",
      type: "text",
      description: "Details about the exchange policy.",
    }),
    defineField({
      name: "refundProcess",
      title: "Refund Process",
      type: "text",
      description: "Details about the refund process.",
    }),
    defineField({
      name: "returnShipping",
      title: "Return Shipping",
      type: "text",
      description: "Details about return shipping.",
    }),
    defineField({
      name: "howToReturn",
      title: "How to Initiate a Return",
      type: "array",
      of: [{ type: "string" }],
      description: "Steps for initiating a return.",
    }),
  ],
})
