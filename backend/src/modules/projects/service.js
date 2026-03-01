import slugify from "slugify";
import { createProject, deleteProject, getProjectBySlug, listAllProjects, listPublicProjects, updateProject, setProjectPublished, setProjectFeatured, reorderProjects } from "./repository.js";

function makeSlug(title) {
  return slugify(title, { lower: true, strict: true });
}

export async function listPublic() {
  const items = await listPublicProjects();
  return items.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    techStack: p.techStack,
    featured: p.featured,
    images: p.images,
    githubUrl: p.githubUrl,
    demoUrl: p.demoUrl,
    published: p.published,
    descriptionMarkdown: p.descriptionMarkdown
  }));
}

export async function getPublicBySlug(slug) {
  const p = await getProjectBySlug(slug);
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    descriptionMarkdown: p.descriptionMarkdown,
    techStack: p.techStack,
    status: p.status,
    images: p.images,
    githubUrl: p.githubUrl,
    demoUrl: p.demoUrl
  };
}

export async function adminList(opts) {
  const result = await listAllProjects(opts);
  return {
    ...result,
    docs: result.docs.map(p => ({
      ...p.toObject(),
      id: p._id.toString()
    }))
  };
}

export async function adminCreate(data) {
  try {
    const slug = data.slug || makeSlug(data.title);
    const project = await createProject({ ...data, slug });
    return { ...project.toObject(), id: project._id.toString() };
  } catch (err) {
    console.error("Error in adminCreate:", err);
    throw err;
  }
}

export async function adminUpdate(id, data) {
  const next = { ...data };
  if (data.title && !data.slug) next.slug = makeSlug(data.title);
  const project = await updateProject(id, next);
  return { ...project.toObject(), id: project._id.toString() };
}

export function adminDelete(id) {
  return deleteProject(id);
}

export function adminPublish(id) {
  return setProjectPublished(id, true);
}

export function adminUnpublish(id) {
  return setProjectPublished(id, false);
}

export function adminFeature(id) {
  return setProjectFeatured(id, true);
}

export function adminUnfeature(id) {
  return setProjectFeatured(id, false);
}

export function adminReorder(idOrder) {
  return reorderProjects(idOrder);
}
