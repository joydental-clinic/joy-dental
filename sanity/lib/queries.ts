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

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id, title, slug, date, category, author, thumbnail, body
}`;

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}`;
