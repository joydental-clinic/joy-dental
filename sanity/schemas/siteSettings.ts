import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "병원 기본정보",
  type: "document",
  fields: [
    defineField({
      name: "phone1",
      title: "전화번호 1",
      type: "string",
    }),
    defineField({
      name: "phone2",
      title: "전화번호 2",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "이메일",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "주소",
      type: "string",
    }),
  ],
});
