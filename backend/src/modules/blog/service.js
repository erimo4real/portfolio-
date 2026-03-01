import slugify from "slugify";
import { createBlog, deleteBlog, getPublishedBySlug, listAllBlogs, listPublishedBlogs, updateBlog, setBlogPublished, reorderBlogs } from "./repository.js";
import { recordAudit } from "../audit/service.js";
import { getVideoEmbedUrl } from "../../lib/video.js";

function makeSlug(title) {
  return slugify(title, { lower: true, strict: true });
}

export async function listPublicBlogs() {
  const items = await listPublishedBlogs();
  return items.map(b => ({ id: b.id, title: b.title, slug: b.slug, image: b.image }));
}

export async function getPublicBlog(slug) {
  const b = await getPublishedBySlug(slug);
  if (!b) return null;
  return { 
    id: b.id, 
    title: b.title, 
    slug: b.slug, 
    markdown: b.markdown,
    image: b.image,
    videoUrl: b.videoUrl,
    videoEmbedUrl: getVideoEmbedUrl(b.videoUrl)
  };
}

export async function adminListBlogs(opts) {
  const result = await listAllBlogs(opts);
  return {
    ...result,
    docs: result.docs.map(b => ({
      ...b.toObject(),
      id: b._id.toString()
    }))
  };
}

export async function adminCreateBlog(data, adminId) {
  const slug = data.slug || makeSlug(data.title);
  const blog = await createBlog({ ...data, slug });
  await recordAudit(adminId, "create", "blog", blog.id, { title: blog.title });
  return { ...blog.toObject(), id: blog._id.toString() };
}

export async function adminUpdateBlog(id, data, adminId) {
  const next = { ...data };
  if (data.title && !data.slug) next.slug = makeSlug(data.title);
  const blog = await updateBlog(id, next);
  await recordAudit(adminId, "update", "blog", id, { title: data.title });
  return { ...blog.toObject(), id: blog._id.toString() };
}

export async function adminDeleteBlog(id, adminId) {
  await deleteBlog(id);
  await recordAudit(adminId, "delete", "blog", id, {});
}

export async function adminPublishBlog(id, adminId) {
  const blog = await setBlogPublished(id, true);
  await recordAudit(adminId, "publish", "blog", id, {});
  return blog;
}

export async function adminUnpublishBlog(id, adminId) {
  const blog = await setBlogPublished(id, false);
  await recordAudit(adminId, "unpublish", "blog", id, {});
  return blog;
}

export async function adminReorderBlogs(idOrder, adminId) {
  await reorderBlogs(idOrder);
  await recordAudit(adminId, "reorder", "blog", "", { idOrder });
}
