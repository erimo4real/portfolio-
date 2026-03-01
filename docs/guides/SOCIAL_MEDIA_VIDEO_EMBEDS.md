# 📱 Social Media Video Embeds Guide

## All Platforms Supported

You can embed videos from:
- ✅ YouTube
- ✅ TikTok
- ✅ Instagram (Reels)
- ✅ Twitter/X
- ✅ Vimeo
- ✅ Facebook
- ✅ LinkedIn
- ✅ Twitch

---

## 🎬 YouTube

### How to Get Video ID:

**From URL:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                 ↑ This is the ID
```

**From Short URL:**
```
https://youtu.be/dQw4w9WgXcQ
                 ↑ This is the ID
```

### Embed Code:
```html
<iframe width="100%" height="400" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

### Quick Method:
1. Go to your video
2. Click "Share" button
3. Click "Embed"
4. Copy the code
5. Paste in your blog post

---

## 🎵 TikTok

### How to Get Embed Code:

**Method 1: From TikTok Website**
1. Go to your TikTok video
2. Click the "Share" button (arrow icon)
3. Click "Embed"
4. Copy the embed code

**Method 2: Manual**
From this URL:
```
https://www.tiktok.com/@username/video/1234567890123456789
```

### Embed Code:
```html
<blockquote class="tiktok-embed" 
  cite="https://www.tiktok.com/@username/video/1234567890123456789" 
  data-video-id="1234567890123456789" 
  style="max-width: 605px; min-width: 325px;">
  <section>
    <a target="_blank" 
       href="https://www.tiktok.com/@username/video/1234567890123456789">
      @username
    </a>
  </section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>
```

### Simplified TikTok Embed:
```html
<iframe 
  src="https://www.tiktok.com/embed/v2/1234567890123456789" 
  width="100%" 
  height="700" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

**Example in Blog Post:**
```markdown
# My TikTok Tech Tips

Check out my latest TikTok on JavaScript tips:

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@yourhandle/video/1234567890" data-video-id="1234567890" style="max-width: 605px; min-width: 325px;">
  <section></section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>

## Key Takeaways
- Tip 1
- Tip 2
```

---

## 📸 Instagram (Reels & Videos)

### How to Get Embed Code:

1. Go to your Instagram post/reel
2. Click the three dots (•••) at the top right
3. Click "Embed"
4. Copy the embed code

### Embed Code Example:
```html
<blockquote class="instagram-media" 
  data-instgrm-permalink="https://www.instagram.com/p/ABC123xyz/" 
  data-instgrm-version="14" 
  style="max-width:540px; min-width:326px; width:100%;">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

### Alternative (iframe method):
```html
<iframe 
  src="https://www.instagram.com/p/ABC123xyz/embed" 
  width="400" 
  height="600" 
  frameborder="0" 
  scrolling="no" 
  allowtransparency="true">
</iframe>
```

**Example in Blog Post:**
```markdown
# Instagram Reel Tutorial

Here's my latest coding reel:

<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/ABC123/" data-instgrm-version="14"></blockquote>
<script async src="//www.instagram.com/embed.js"></script>

## What I Covered
- React hooks
- State management
```

---

## 🐦 Twitter/X (Videos)

### How to Embed:

1. Go to the tweet with video
2. Click the three dots (•••)
3. Click "Embed Tweet"
4. Copy the code

### Embed Code:
```html
<blockquote class="twitter-tweet">
  <p lang="en" dir="ltr">
    Your tweet text
    <a href="https://t.co/abc123">pic.twitter.com/abc123</a>
  </p>
  &mdash; Your Name (@yourhandle) 
  <a href="https://twitter.com/yourhandle/status/1234567890">Date</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
```

**Example in Blog Post:**
```markdown
# Quick JavaScript Tip

I shared this tip on Twitter:

<blockquote class="twitter-tweet">
  <a href="https://twitter.com/yourhandle/status/1234567890"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js"></script>

## Detailed Explanation
...
```

---

## 🎥 Vimeo

### How to Get Video ID:

From URL:
```
https://vimeo.com/123456789
                   ↑ This is the ID
```

### Embed Code:
```html
<iframe 
  src="https://player.vimeo.com/video/123456789" 
  width="100%" 
  height="400" 
  frameborder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowfullscreen>
</iframe>
```

### Quick Method:
1. Go to your video
2. Click "Share" button
3. Copy embed code
4. Paste in blog post

---

## 📘 Facebook Videos

### How to Embed:

1. Go to your Facebook video
2. Click the three dots (•••)
3. Click "Embed"
4. Copy the code

### Embed Code:
```html
<iframe 
  src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fuser%2Fvideos%2F123456789" 
  width="100%" 
  height="400" 
  style="border:none;overflow:hidden" 
  scrolling="no" 
  frameborder="0" 
  allowfullscreen="true" 
  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
</iframe>
```

---

## 💼 LinkedIn Videos

### How to Embed:

LinkedIn doesn't provide direct embed codes, but you can:

**Option 1: Link to the post**
```markdown
[Watch my LinkedIn video](https://www.linkedin.com/posts/yourprofile_activity-123456789)
```

**Option 2: Upload to YouTube and embed**
1. Download your LinkedIn video
2. Upload to YouTube
3. Embed YouTube video

---

## 🎮 Twitch Clips

### How to Get Embed Code:

1. Go to your Twitch clip
2. Click "Share"
3. Click "Embed"
4. Copy the code

### Embed Code:
```html
<iframe 
  src="https://clips.twitch.tv/embed?clip=ClipSlugHere&parent=yourdomain.com" 
  height="400" 
  width="100%" 
  allowfullscreen>
</iframe>
```

---

## 🎯 Complete Blog Post Example (Multiple Platforms)

```markdown
# My Tech Tips Across All Platforms

I share coding tips on multiple platforms. Here's a roundup!

## YouTube Tutorial

<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

## TikTok Quick Tip

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/123" data-video-id="123" style="max-width: 605px;">
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>

## Instagram Reel

<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/ABC/" data-instgrm-version="14"></blockquote>
<script async src="//www.instagram.com/embed.js"></script>

## Twitter Thread

<blockquote class="twitter-tweet">
  <a href="https://twitter.com/user/status/123"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js"></script>

## Key Takeaways

- Point 1
- Point 2
- Point 3

## Follow Me

- YouTube: [@yourhandle](link)
- TikTok: [@yourhandle](link)
- Instagram: [@yourhandle](link)
- Twitter: [@yourhandle](link)
```

---

## 📱 Responsive Styling (Already Added!)

Your blog already has responsive styling for all embeds. Videos will automatically:
- Adjust to screen size
- Work on mobile devices
- Have rounded corners
- Include shadows
- Look professional

---

## 🎨 Custom Styling for Social Media

Add this to your blog post for better social media embed styling:

```markdown
<style>
  .tiktok-embed, .instagram-media, .twitter-tweet {
    margin: 2rem auto !important;
    max-width: 100% !important;
  }
  
  blockquote {
    border-left: 4px solid #667eea;
    padding-left: 1.5rem;
    margin: 2rem 0;
  }
</style>
```

---

## ⚡ Quick Reference Table

| Platform | Embed Method | Difficulty | Mobile Support |
|----------|-------------|------------|----------------|
| YouTube | iframe | ⭐ Easy | ✅ Perfect |
| TikTok | blockquote + script | ⭐⭐ Medium | ✅ Perfect |
| Instagram | blockquote + script | ⭐⭐ Medium | ✅ Perfect |
| Twitter | blockquote + script | ⭐⭐ Medium | ✅ Perfect |
| Vimeo | iframe | ⭐ Easy | ✅ Perfect |
| Facebook | iframe | ⭐⭐ Medium | ✅ Good |
| LinkedIn | Link only | ⭐ Easy | ✅ Perfect |
| Twitch | iframe | ⭐⭐ Medium | ✅ Good |

---

## 💡 Best Practices

### 1. **Mix Platforms Strategically**
- Long tutorials → YouTube
- Quick tips (< 1 min) → TikTok
- Visual demos → Instagram Reels
- Code snippets → Twitter
- Professional content → LinkedIn

### 2. **Always Add Written Content**
- Not everyone watches videos
- Better for SEO
- Accessible to all users

### 3. **Optimize for Mobile**
- Test on phone before publishing
- Use responsive embeds
- Keep videos short for mobile viewers

### 4. **Cross-Promote**
```markdown
## Watch on Your Favorite Platform

- 📺 [YouTube](link) - Full tutorial
- 🎵 [TikTok](link) - 60-second version
- 📸 [Instagram](link) - Visual demo
- 🐦 [Twitter](link) - Code snippets
```

---

## 🚀 Getting Started Checklist

- [ ] Choose your primary platform (YouTube recommended)
- [ ] Create accounts on platforms you want to use
- [ ] Record your first video
- [ ] Upload to platform(s)
- [ ] Get embed code
- [ ] Create blog post
- [ ] Paste embed code
- [ ] Add written content
- [ ] Test on mobile
- [ ] Publish!

---

## ❓ Common Questions

**Q: Can I embed from all platforms in one post?**
A: Yes! Mix and match as needed.

**Q: Which platform is best for tech content?**
A: YouTube for long-form, TikTok for quick tips, Twitter for code snippets.

**Q: Do I need to change my code?**
A: No! Just paste the embed codes in your markdown.

**Q: Will this slow down my site?**
A: No! Each platform hosts their own videos.

**Q: Can I monetize?**
A: Yes on YouTube, TikTok Creator Fund, and others.

**Q: What about copyright?**
A: Only embed your own videos or with permission.

---

## 🎯 Recommended Strategy

**For Your Portfolio Blog:**

1. **Main Content: YouTube**
   - Full tutorials (5-15 min)
   - In-depth explanations
   - Professional quality

2. **Quick Tips: TikTok**
   - 15-60 second tips
   - Trending topics
   - Viral potential

3. **Visual Demos: Instagram Reels**
   - UI/UX showcases
   - Before/after comparisons
   - Design tips

4. **Code Snippets: Twitter**
   - Quick code examples
   - One-liners
   - Discussions

5. **Professional: LinkedIn**
   - Career advice
   - Industry insights
   - Networking

---

## 🎬 Content Ideas by Platform

### YouTube (5-15 min)
- "Complete React Tutorial"
- "Building a REST API"
- "Portfolio Website Walkthrough"

### TikTok (15-60 sec)
- "JavaScript in 30 Seconds"
- "CSS Trick of the Day"
- "Git Command You Need"

### Instagram Reels (30-90 sec)
- "UI Design Tips"
- "Code Editor Setup"
- "Day in the Life of a Developer"

### Twitter (Text + Short Video)
- Code snippets with explanation
- Bug fixes
- Quick tips

---

## ✅ You're All Set!

Your blog now supports videos from:
- ✅ YouTube
- ✅ TikTok
- ✅ Instagram
- ✅ Twitter
- ✅ Vimeo
- ✅ Facebook
- ✅ Twitch

Just paste the embed codes and publish! 🚀
