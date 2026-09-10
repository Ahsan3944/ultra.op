export const SITE = {
  name: 'UltraOP',
  creator: 'Sk Ahsan Ahmad',
  tagline: 'Gaming creator • storyteller • community builder',
  domain: 'https://ultraop.in',
  businessEmail: 'ultraopbiz@gmail.com',
  upi: 'ultraop001@ybl',
  rooter: 'https://www.rooter.gg/profile/142404154',
  youtube: 'https://www.youtube.com/@ultraoplive',
  instagram: 'https://www.instagram.com/ultraopp/',
  discord: 'https://discord.gg/6sWsg324md',
} as const;

// Add future official YouTube channels here. The homepage renders this array automatically.
export const YOUTUBE_CHANNELS = [
  { key: 'main', id: 'UCAxlmL3_721xzOjQVe5Klbg', name: 'Ultra OP Live', handle: '@ultraoplive', url: 'https://www.youtube.com/@ultraoplive', focus: 'Live gaming, Minecraft, Valorant & variety' },
  { key: 'earnings', id: 'UC-KkWDruqOobwZgylSb4kwA', name: 'Op Earnings', handle: '@ultraopearnings', url: 'https://www.youtube.com/@ultraopearnings', focus: 'Creator growth & gaming income' },
  { key: 'minecraft', id: 'UC-ASoLp2wfxVLJFDnVXwrGA', name: 'Ultra OP 2.0', handle: '@ultraop2', url: 'https://www.youtube.com/@ultraop2', focus: 'Minecraft hardcore, SMP & redstone' },
  { key: 'roblox', id: 'UCKdJiKSiO382Hvczh_Q2kyg', name: 'Roblox UltraOP3', handle: '@ultraop3', url: 'https://www.youtube.com/@ultraop3', focus: 'Roblox adventures & multiplayer' },
] as const;

// Keep all verified social, streaming and community destinations in this registry.
// Add future platforms here; the homepage consumes this registry automatically.
export const SOCIALS = [
  { name: 'Instagram', handle: '@ultraopp', url: 'https://www.instagram.com/ultraopp/', type: 'Social' },
  { name: 'Instagram / Earnings', handle: '@op_earnings', url: 'https://www.instagram.com/op_earnings/', type: 'Social' },
  { name: 'Instagram / Ahsan Now', handle: '@ahsannow', url: 'https://www.instagram.com/ahsannow/', type: 'Social' },
  { name: 'Twitch', handle: '@ultraoplive', url: 'https://www.twitch.tv/ultraoplive', type: 'Streaming' },
  { name: 'Kick', handle: '@ultra-op-live', url: 'https://kick.com/ultra-op-live', type: 'Streaming' },
  { name: 'Rooter', handle: 'UltraOP', url: 'https://www.rooter.gg/profile/142404154', type: 'Streaming' },
  { name: 'Discord', handle: '6sWsg324md', url: 'https://discord.gg/6sWsg324md', type: 'Community' },
  { name: 'WhatsApp Channel', handle: 'UltraOP', url: 'https://www.whatsapp.com/channel/0029VaeMLDaHgZWfuPDefa0t', type: 'Community' },
] as const;

export const BRAND_CAMPAIGNS = [
  { name: 'Amazon', type: 'Promotional Campaign', category: 'E-Commerce & Tech', year: '2023–2024' },
  { name: 'THE FINALS', type: 'Game Launch & Esports Campaign', category: 'Competitive FPS', year: '2024' },
  { name: 'Wild Stone', type: 'Creator Lifestyle Campaign', category: 'Men’s Grooming & Lifestyle', year: '2023' },
  { name: 'Hero', type: 'Brand Campaign', category: 'Mobility & Automotive', year: '2023–2024' },
  { name: 'Parallel Mobile', type: 'Mobile App Campaign', category: 'Mobile Gaming & Utilities', year: '2024' },
  { name: 'TVS', type: 'Brand Campaign', category: 'Automotive & Lifestyle', year: '2023' },
] as const;
