import { defineType, defineField } from "sanity";

export default defineType({
  name: "notice",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "슬러그",
      type: "slug",
      options: { source: "title", maxLength: 200 },
    }),
    defineField({
      name: "date",
      title: "날짜",
      type: "datetime",
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "string",
      options: {
        list: [
          { title: "일반", value: "일반" },
          { title: "진료안내", value: "진료안내" },
          { title: "휴진안내", value: "휴진안내" },
        ],
      },
    }),
    defineField({
      name: "pinned",
      title: "상단 고정",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "본문",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "대체 텍스트",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "고정 우선 + 최신순",
      name: "pinnedDateDesc",
      by: [
        { field: "pinned", direction: "desc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
});
