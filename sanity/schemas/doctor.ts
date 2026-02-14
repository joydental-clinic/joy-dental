import { defineType, defineField } from "sanity";

export default defineType({
  name: "doctor",
  title: "의료진",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "이름",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "직함",
      type: "string",
    }),
    defineField({
      name: "tag",
      title: "태그",
      type: "string",
      options: {
        list: [
          { title: "임플란트", value: "implant" },
          { title: "교정", value: "ortho" },
          { title: "일반", value: "general" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "프로필 사진",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "initial",
      title: "이니셜",
      type: "string",
    }),
    defineField({
      name: "specialties",
      title: "전문 분야",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "order",
      title: "순서",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
