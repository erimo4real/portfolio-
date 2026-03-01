export function getVideoEmbedUrl(url) {
  if (!url) return null;
  
  // YouTube - standard URLs
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // YouTube Shorts
  const youtubeShortsMatch = url.match(/youtube\.com\/shorts\/([^&\s]+)/);
  if (youtubeShortsMatch) {
    return `https://www.youtube.com/embed/${youtubeShortsMatch[1]}`;
  }
  
  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w-]+\/video\/(\d+)/);
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
  }
  
  // TikTok alternative format
  const tiktokAltMatch = url.match(/tiktok\.com\/v\/(\d+)/);
  if (tiktokAltMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokAltMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // Twitter/X
  const twitterMatch = url.match(/twitter\.com\/\w+\/status\/(\d+)/);
  if (twitterMatch) {
    return `https://platform.twitter.com/embed/Tweet.html?id=${twitterMatch[1]}`;
  }
  
  // x.com (new Twitter)
  const xMatch = url.match(/x\.com\/\w+\/status\/(\d+)/);
  if (xMatch) {
    return `https://platform.twitter.com/embed/Tweet.html?id=${xMatch[1]}`;
  }
  
  // Instagram
  const instagramMatch = url.match(/instagram\.com\/p\/([^\/]+)/);
  if (instagramMatch) {
    return `https://www.instagram.com/p/${instagramMatch[1]}/embed`;
  }
  
  // Facebook
  const facebookMatch = url.match(/facebook\.com\/[\w.-]+\/videos\/(\d+)/);
  if (facebookMatch) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
  }
  
  // Dailymotion
  const dailymotionMatch = url.match(/dailymotion\.com\/video\/([^\-_]+)/);
  if (dailymotionMatch) {
    return `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`;
  }
  
  return null;
}
