import { defineType, defineField } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "히어로 슬라이드",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "이미지",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "대체 텍스트",
      type: "string",
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
