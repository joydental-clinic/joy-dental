export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  phone1, phone2, email, address
}`;

export const heroSlidesQuery = `*[_type == "heroSlide"] | order(order asc){
  _id, image, alt, order
}`;

export const doctorsQuery = `*[_type == "doctor"] | order(order asc){
  _id, name, title, tag, initial, image, specialties, order
}`;

export const hoursQuery = `*[_type == "hours"][0]{
  schedule
}`;

export const postsQuery = `*[_type == "post"] | order(date desc){
  _id, title, slug, date, category, author, thumbnail,
  "excerpt": pt::text(body)
}`;

export const recentPostsQuery = `*[_type == "post"] | order(date desc)[0...6]{
  _id, title, slug, date, category, author, thumbnail,
  "excerpt": pt::text(body),
  "firstImage": body[_type == "image"][0]
}`;

export const postsByCategoryQuery = `*[_type == "post" && category == $category] | order(date desc){
  _id, title, slug, date, category, author, thumbnail,
  "excerpt": pt::text(body)
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id, title, slug, date, category, author, thumbnail, body
}`;

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}`;

// 공지사항 쿼리
export const noticesQuery = `*[_type == "notice"] | order(pinned desc, date desc){
  _id, title, slug, date, category, pinned,
  "excerpt": pt::text(body)
}`;

export const recentNoticesQuery = `*[_type == "notice"] | order(pinned desc, date desc)[0...5]{
  _id, title, slug, date, category, pinned
}`;

export const noticeBySlugQuery = `*[_type == "notice" && slug.current == $slug][0]{
  _id, title, slug, date, category, pinned, body
}`;

export const noticeSlugsQuery = `*[_type == "notice" && defined(slug.current)]{
  "slug": slug.current
}`;

export const pinnedNoticeQuery = `*[_type == "notice" && pinned == true] | order(date desc) {
  _id, title, slug, category
}`;
