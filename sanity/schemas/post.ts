import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "블로그 포스트",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
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
          { title: "교정", value: "ortho" },
          { title: "임플란트", value: "implant" },
          { title: "일반", value: "general" },
        ],
      },
    }),
    defineField({
      name: "author",
      title: "작성자",
      type: "string",
    }),
    defineField({
      name: "thumbnail",
      title: "썸네일",
      type: "image",
      options: { hotspot: true },
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
      title: "날짜 (최신순)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
