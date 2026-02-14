import { defineType, defineField } from "sanity";

export default defineType({
  name: "hours",
  title: "진료시간",
  type: "document",
  fields: [
    defineField({
      name: "schedule",
      title: "진료 스케줄",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "요일",
              type: "string",
            }),
            defineField({
              name: "time",
              title: "시간",
              type: "string",
            }),
            defineField({
              name: "highlight",
              title: "강조",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "closed",
              title: "휴진",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
    }),
  ],
});
