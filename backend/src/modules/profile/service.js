import { createOrUpdateProfile, getPublishedProfile, listProfiles, updateProfile, getProfileById, getProfileByAdminId } from "./repository.js";
import { recordAudit } from "../audit/service.js";
import { logger } from "../../middleware/error.js";

export async function getPublicProfile() {
  const p = await getPublishedProfile();
  if (!p) return null;
  
  return {
    name: p.name,
    headline: p.headline,
    bioMarkdown: p.bioMarkdown,
    imagePath: p.imagePath
  };
}

export async function getMainProfileForAdmin(adminId) {
  try {
    let profile = await getProfileByAdminId(adminId);
    
    if (!profile) {
      return {
        id: null,
        adminId: adminId,
        name: '',
        headline: '',
        bioMarkdown: '',
        status: 'draft',
        imagePath: null
      };
    }
    
    return profile;
  } catch (error) {
    logger.error({ err: error }, 'Error in getMainProfileForAdmin');
    return {
      id: null,
      adminId: adminId,
      name: '',
      headline: '',
      bioMarkdown: '',
      status: 'draft',
      imagePath: null
    };
  }
}

export async function adminCreateProfile(data, adminId) {
  try {
    const profile = await createOrUpdateProfile(adminId, data);
    await recordAudit(adminId, "create", "profile", profile.id, { headline: data.headline || "Profile Updated" });
    return profile;
  } catch (error) {
    logger.error({ err: error }, 'Error in adminCreateProfile');
    throw error;
  }
}

export async function adminUpdateProfile(id, data, adminId) {
  try {
    const profile = await updateProfile(id, data);
    await recordAudit(adminId, "update", "profile", id, { headline: data.headline || profile?.headline || "Profile Updated" });
    return profile;
  } catch (error) {
    logger.error({ err: error }, 'Error in adminUpdateProfile');
    throw error;
  }
}

export async function adminListProfiles(opts) {
  return listProfiles(opts);
}

export async function adminPublishProfile(id, adminId) {
  const p = await getProfileById(id);
  if (!p) throw Object.assign(new Error("Not found"), { status: 404 });
  const updated = await updateProfile(id, { status: "published" });
  await recordAudit(adminId, "publish", "profile", id, {});
  return updated;
}

export async function adminUnpublishProfile(id, adminId) {
  const p = await getProfileById(id);
  if (!p) throw Object.assign(new Error("Not found"), { status: 404 });
  const updated = await updateProfile(id, { status: "draft" });
  await recordAudit(adminId, "unpublish", "profile", id, {});
  return updated;
}
