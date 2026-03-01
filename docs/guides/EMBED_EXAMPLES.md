# 🎬 Video Embed Examples - Copy & Paste Ready

## Quick Copy-Paste Templates

---

## 1️⃣ YouTube Video

### Get the ID:
```
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
ID:  dQw4w9WgXcQ (everything after "v=")
```

### Copy This:
```html
<iframe width="100%" height="400" 
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```

### Replace:
- `YOUR_VIDEO_ID` with your actual video ID

### Example Blog Post:
```markdown
# JavaScript Tips

Watch my tutorial:

<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

## What You'll Learn
- Tip 1
- Tip 2
```

---

## 2️⃣ TikTok Video

### Get the Video ID:
```
URL: https://www.tiktok.com/@username/video/7123456789012345678
ID:  7123456789012345678 (the long number at the end)
```

### Method 1: Official Embed (Recommended)
```html
<blockquote class="tiktok-embed" 
  cite="https://www.tiktok.com/@username/video/7123456789012345678" 
  data-video-id="7123456789012345678" 
  style="max-width: 605px; min-width: 325px; margin: 0 auto;">
  <section>
    <a target="_blank" href="https://www.tiktok.com/@username">@username</a>
  </section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>
```

### Method 2: Simple iframe
```html
<div style="max-width: 605px; margin: 0 auto;">
  <iframe 
    src="https://www.tiktok.com/embed/v2/7123456789012345678" 
    width="100%" 
    height="700" 
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>
```

### Replace:
- `@username` with your TikTok handle
- `7123456789012345678` with your video ID

### Example Blog Post:
```markdown
# Quick CSS Tip

Here's my 30-second TikTok on Flexbox:

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@yourhandle/video/7123456789" data-video-id="7123456789" style="max-width: 605px; margin: 0 auto;">
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>

## Detailed Explanation
...
```

---

## 3️⃣ Instagram Reel/Video

### Get the Post Code:
```
URL: https://www.instagram.com/p/CaBcDeFgHiJ/
Code: CaBcDeFgHiJ (everything after "/p/")
```

### Copy This:
```html
<blockquote class="instagram-media" 
  data-instgrm-captioned 
  data-instgrm-permalink="https://www.instagram.com/p/CaBcDeFgHiJ/" 
  data-instgrm-version="14" 
  style="max-width:540px; min-width:326px; width:100%; margin: 0 auto;">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

### Replace:
- `CaBcDeFgHiJ` with your post code

### Example Blog Post:
```markdown
# React Hooks Tutorial

Check out my Instagram reel:

<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/ABC123/" data-instgrm-version="14" style="margin: 0 auto;">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>

## Full Tutorial
...
```

---

## 4️⃣ Twitter/X Video

### Copy This:
```html
<blockquote class="twitter-tweet" data-theme="light">
  <a href="https://twitter.com/username/status/1234567890123456789"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
```

### Replace:
- `username` with your Twitter handle
- `1234567890123456789` with your tweet ID

### Get Tweet ID:
```
URL: https://twitter.com/username/status/1234567890123456789
ID:  1234567890123456789 (the long number at the end)
```

### Example Blog Post:
```markdown
# JavaScript Array Methods

I shared this tip on Twitter:

<blockquote class="twitter-tweet">
  <a href="https://twitter.com/yourhandle/status/1234567890"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js"></script>

## Detailed Code
...
```

---

## 5️⃣ Vimeo Video

### Get the Video ID:
```
URL: https://vimeo.com/123456789
ID:  123456789 (the number at the end)
```

### Copy This:
```html
<iframe 
  src="https://player.vimeo.com/video/123456789?h=abc123def4" 
  width="100%" 
  height="400" 
  frameborder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowfullscreen>
</iframe>
```

### Replace:
- `123456789` with your video ID

### Example Blog Post:
```markdown
# Web Design Tutorial

Watch on Vimeo:

<iframe src="https://player.vimeo.com/video/123456789" width="100%" height="400" frameborder="0" allowfullscreen></iframe>

## Key Points
...
```

---

## 6️⃣ Facebook Video

### Steps:
1. Go to your Facebook video
2. Click three dots (•••)
3. Click "Embed"
4. Copy the code
5. Paste in blog post

### Example Code:
```html
<iframe 
  src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fuser%2Fvideos%2F123456789" 
  width="100%" 
  height="400" 
  style="border:none;overflow:hidden" 
  scrolling="no" 
  frameborder="0" 
  allowfullscreen="true">
</iframe>
```

---

## 🎯 Multi-Platform Blog Post Template

```markdown
# My Tech Tips - All Platforms

I share coding tips everywhere! Here's the same tip across different platforms:

## 📺 Full Tutorial on YouTube (10 minutes)

<iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

---

## 🎵 Quick Version on TikTok (60 seconds)

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/123" data-video-id="123" style="max-width: 605px; margin: 0 auto;">
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>

---

## 📸 Visual Demo on Instagram (30 seconds)

<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/ABC/" data-instgrm-version="14" style="margin: 0 auto;">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>

---

## 🐦 Code Snippet on Twitter

<blockquote class="twitter-tweet">
  <a href="https://twitter.com/user/status/123"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js"></script>

---

## 📝 Written Guide

For those who prefer reading, here's the complete guide:

### Step 1: Setup
...

### Step 2: Implementation
...

### Step 3: Testing
...

## 💻 Code Example

\`\`\`javascript
const example = "Hello World";
console.log(example);
\`\`\`

## 🔗 Follow Me

- YouTube: [@yourhandle](link)
- TikTok: [@yourhandle](link)
- Instagram: [@yourhandle](link)
- Twitter: [@yourhandle](link)

## 📚 Related Posts

- [Post 1](#)
- [Post 2](#)
- [Post 3](#)
```

---

## 🎨 Styling Tips

### Center Videos:
```html
<div style="max-width: 800px; margin: 0 auto;">
  <!-- Your embed code here -->
</div>
```

### Add Spacing:
```html
<div style="margin: 3rem 0;">
  <!-- Your embed code here -->
</div>
```

### Side-by-Side (Desktop):
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0;">
  <div>
    <!-- Video 1 -->
  </div>
  <div>
    <!-- Video 2 -->
  </div>
</div>
```

---

## ⚡ Quick Tips

### 1. Always Test on Mobile
- Open your blog on phone
- Check if videos load
- Verify they're responsive

### 2. Add Fallback Text
```markdown
<iframe src="..."></iframe>

*Can't see the video? [Watch on YouTube](link)*
```

### 3. Include Timestamps
```markdown
## Video Timestamps
- 0:00 - Introduction
- 2:30 - Setup
- 5:45 - Implementation
- 8:20 - Testing
```

### 4. Provide Multiple Options
```markdown
## Watch This Tutorial

- 📺 [YouTube](link) - Full version (10 min)
- 🎵 [TikTok](link) - Quick version (60 sec)
- 📸 [Instagram](link) - Visual demo (30 sec)
```

---

## 🚀 Ready-to-Use Templates

### Template 1: Single Platform
```markdown
# [Your Title]

[Introduction paragraph]

## 📹 Video Tutorial

[PASTE EMBED CODE HERE]

## What You'll Learn

- Point 1
- Point 2
- Point 3

## Code Example

\`\`\`javascript
// Your code
\`\`\`

## Conclusion

[Wrap up]
```

### Template 2: Multi-Platform
```markdown
# [Your Title]

Choose your preferred platform:

## YouTube (Full Tutorial)
[YOUTUBE EMBED]

## TikTok (Quick Version)
[TIKTOK EMBED]

## Instagram (Visual Demo)
[INSTAGRAM EMBED]

## Written Guide
[Your content]
```

### Template 3: Video + Article
```markdown
# [Your Title]

## 🎬 Watch First (Optional)

[VIDEO EMBED]

*Prefer reading? Continue below!*

---

## Introduction

[Your content]

## Step-by-Step Guide

### Step 1
...

### Step 2
...

## Conclusion
...
```

---

## ✅ Checklist Before Publishing

- [ ] Video is uploaded to platform
- [ ] Embed code is copied correctly
- [ ] Video ID is replaced in template
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Added written content
- [ ] Included code examples
- [ ] Added related links
- [ ] Checked for typos
- [ ] Published!

---

## 🎯 You're Ready!

Just:
1. Pick a template above
2. Replace the IDs with yours
3. Paste in your blog post
4. Add your content
5. Publish!

**No coding needed. Just copy, paste, and go!** 🚀
