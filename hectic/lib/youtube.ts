import { extractYouTubeId } from "./utils";

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  embedUrl: string;
  mockTranscript: string;
}

export async function fetchYouTubeInfo(url: string): Promise<YouTubeVideoInfo> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL. Please check the video link.");
  }

  // Attempt OEmbed fetch for actual video title & author
  let title = "Physics / Chemistry Lecture Note";
  let channelTitle = "JEE & NEET Top Faculty";

  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (res.ok) {
      const data = await res.json();
      title = data.title || title;
      channelTitle = data.author_name || channelTitle;
    }
  } catch (err) {
    console.warn("OEmbed fetch fallback used:", err);
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  // Mock transcript simulating spoken lecture + board writing notes
  const mockTranscript = `
[00:15] Welcome students to today's JEE Main & Advanced lecture.
[01:00] Today we will solve rigid body dynamics and moment of inertia.
[02:30] (Writing on Board): I_cm for a uniform disc = 1/2 M R^2.
[04:15] (Writing on Board): Parallel Axis Theorem: I = I_cm + M * d^2.
[07:00] Let's take an example: Find moment of inertia of disc about tangent parallel to diameter.
[09:30] Remember for diameter axis: I_dia = 1/4 M R^2.
[12:00] Therefore by parallel axis: I_tangent = 1/4 M R^2 + M R^2 = 5/4 M R^2.
[15:45] Pay close attention to NEET and JEE past year questions on rolling without slipping.
[18:00] When a cylinder rolls without slipping down an incline, acceleration a = g sin(theta) / (1 + I / M R^2).
[22:10] (Teacher emphasizes): Note down this formula in your formula notebook right now!
`;

  return {
    videoId,
    title,
    channelTitle,
    thumbnailUrl,
    embedUrl,
    mockTranscript
  };
}
