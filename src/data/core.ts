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

export const YOUTUBE_CHANNELS = [
  { key: 'main', id: 'UCAxlmL3_721xzOjQVe5Klbg', name: 'Ultra OP Live', handle: '@ultraoplive', url: 'https://www.youtube.com/@ultraoplive', focus: 'Live gaming, Minecraft, Valorant & variety' },
  { key: 'earnings', id: 'UC-KkWDruqOobwZgylSb4kwA', name: 'Op Earnings', handle: '@ultraopearnings', url: 'https://www.youtube.com/@ultraopearnings', focus: 'Creator growth & gaming income' },
  { key: 'minecraft', id: 'UC-ASoLp2wfxVLJFDnVXwrGA', name: 'Ultra OP 2.0', handle: '@ultraop2', url: 'https://www.youtube.com/@ultraop2', focus: 'Minecraft hardcore, SMP & redstone' },
  { key: 'roblox', id: 'UCKdJiKSiO382Hvczh_Q2kyg', name: 'Roblox UltraOP3', handle: '@ultraop3', url: 'https://www.youtube.com/@ultraop3', focus: 'Roblox adventures & multiplayer' },
] as const;

export const SOCIALS = [
  { name: 'Instagram', handle: '@ultraopp', url: 'https://www.instagram.com/ultraopp/' },
  { name: 'Instagram / Earnings', handle: '@op_earnings', url: 'https://www.instagram.com/op_earnings/' },
  { name: 'Instagram / Ahsan Now', handle: '@ahsannow', url: 'https://www.instagram.com/ahsannow/' },
  { name: 'Twitch', handle: '@ultraoplive', url: 'https://www.twitch.tv/ultraoplive' },
  { name: 'Kick', handle: '@ultra-op-live', url: 'https://kick.com/ultra-op-live' },
  { name: 'Discord', handle: '6sWsg324md', url: 'https://discord.gg/6sWsg324md' },
  { name: 'WhatsApp Channel', handle: 'UltraOP', url: 'https://www.whatsapp.com/channel/0029VaeMLDaHgZWfuPDefa0t' },
] as const;

export const BRAND_CAMPAIGNS = [
  { name: 'Amazon', type: 'Promotional Campaign', category: 'E-Commerce & Tech', year: '2023–2024' },
  { name: 'THE FINALS', type: 'Game Launch & Esports Campaign', category: 'Competitive FPS', year: '2024' },
  { name: 'Wild Stone', type: 'Creator Lifestyle Campaign', category: 'Men’s Grooming & Lifestyle', year: '2023' },
  { name: 'Hero', type: 'Brand Campaign', category: 'Mobility & Automotive', year: '2023–2024' },
  { name: 'Parallel Mobile', type: 'Mobile App Campaign', category: 'Mobile Gaming & Utilities', year: '2024' },
  { name: 'TVS', type: 'Brand Campaign', category: 'Automotive & Lifestyle', year: '2023' },
] as const;

export const GAMES = [
  { id: 'trivia', name: 'Gamer Trivia', category: 'Quiz', description: 'Fast multi-game trivia with timed rounds.' },
  { id: 'zen', name: 'Zen Tile', category: 'Relaxing', description: 'A calm 2048-style merge experience.' },
  { id: 'bubble', name: 'Bubble Zen', category: 'Relaxing', description: 'Pop, chain, and unwind.' },
  { id: 'aim', name: 'Reflex Aim Pro', category: 'Reflex', description: 'Reaction and flick training.' },
  { id: 'cyber-strike', name: 'Cyber Strike', category: 'Action', description: 'Top-down neon arcade combat.' },
  { id: 'snake', name: 'Neon Snake', category: 'Arcade', description: 'Classic snake, rebuilt for modern touch.' },
  { id: 'dash', name: 'Cyber Dash', category: 'Casual', description: 'Tap through anti-gravity gates.' },
] as const;
