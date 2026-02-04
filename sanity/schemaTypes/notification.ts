import { defineField, defineType } from "sanity"

export const notificationType = defineType({
  name: "notification",
  title: "Notification",
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "string",
      description: "The message to display in the notification banner.",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      description: "Whether the notification is currently active.",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "The date and time when the notification should start being displayed.",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "The date and time when the notification should stop being displayed.",
    }),
  ],
})
