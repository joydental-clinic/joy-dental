import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "coabe46s";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "yonsei-joy-dental",
  title: "연세조이치과",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .id("siteSettings")
              .title("사이트 설정")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .id("hours")
              .title("영업시간")
              .child(S.document().schemaType("hours").documentId("hours")),
            S.divider(),
            S.documentTypeListItem("heroSlide").title("히어로 슬라이드"),
            S.documentTypeListItem("doctor").title("의료진"),
            S.divider(),
            S.listItem()
              .id("post")
              .title("블로그 포스트")
              .child(
                S.list()
                  .id("post-categories")
                  .title("블로그 포스트")
                  .items([
                    S.listItem()
                      .id("post-ortho")
                      .title("교정")
                      .child(
                        S.documentList()
                          .id("post-list-ortho")
                          .title("교정")
                          .filter('_type == "post" && category == "ortho"')
                      ),
                    S.listItem()
                      .id("post-implant")
                      .title("임플란트")
                      .child(
                        S.documentList()
                          .id("post-list-implant")
                          .title("임플란트")
                          .filter('_type == "post" && category == "implant"')
                      ),
                    S.listItem()
                      .id("post-general")
                      .title("일반")
                      .child(
                        S.documentList()
                          .id("post-list-general")
                          .title("일반")
                          .filter('_type == "post" && category == "general"')
                      ),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem("notice").title("공지사항"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
