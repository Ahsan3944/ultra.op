export type JournalEntry = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string[];
  era: string;
  tags: string[];
};

// Exact dates are intentionally omitted until the creator supplies them. The sequence reflects the creator's own timeline.
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'pubg-beginning', eyebrow: 'ORIGIN / PUBG', title: 'The journey started with PUBG',
    summary: 'Before UltraOP became a creator identity, the journey began with PUBG during the India era of the game.',
    body: ['PUBG was the starting point of the competitive gaming journey. Playing during the period when PUBG existed in India, the focus quickly grew beyond casual matches and into competitive gaming, teams and organised play.'], era: 'Early competitive era', tags: ['PUBG', 'Competitive Gaming', 'Esports'],
  },
  {
    slug: 'competitive-teams', eyebrow: 'ESPORTS / TEAMS', title: 'Multiple teams, multiple competitive chapters',
    summary: 'The competitive phase included playing with multiple teams, including Indian Falcon and Esports Mania, with achievements across that era.',
    body: ['The journey included multiple competitive teams and line-ups. Indian Falcon and Esports Mania were among the teams and communities connected to this chapter, with different achievements built along the way.'], era: 'Competitive chapter', tags: ['Indian Falcon', 'Esports Mania', 'Teams'],
  },
  {
    slug: 'esm-scrims', eyebrow: 'ESM / SCRIMS', title: 'Building the scrim ecosystem',
    summary: 'Esports Mania grew into a Discord-based ecosystem where PUBG and BGMI scrims were organised across T1, T2 and T3 levels.',
    body: ['The Esports Mania chapter was not only about playing. A full Discord community and server ecosystem grew around organised PUBG and BGMI scrims, with T1, T2 and T3 level matches giving players a structured competitive environment.'], era: 'Esports Mania chapter', tags: ['ESM', 'BGMI', 'PUBG', 'Scrims', 'Discord'],
  },
  {
    slug: 'pubg-ban-transition', eyebrow: 'TRANSITION / ROOTER', title: 'PUBG was banned. The platform changed.',
    summary: 'When PUBG was banned in India, the next opportunity came through Rooter.',
    body: ['The PUBG chapter ended with the ban in India. Instead of leaving gaming behind, the journey shifted toward Rooter, opening a new chapter where playing became live broadcasting.'], era: 'Platform transition', tags: ['PUBG', 'Rooter', 'Transition'],
  },
  {
    slug: 'rooter-free-fire-streaming', eyebrow: 'ROOTER / FREE FIRE', title: 'Learning Free Fire live',
    summary: 'Rooter became the place to stream Free Fire live while learning the game from the ground up.',
    body: ['Free Fire was a new game to learn. Rooter became the place to stream it live, learn in public, interact with viewers and gradually build confidence as a broadcaster rather than only as a player.'], era: 'Rooter streaming era', tags: ['Rooter', 'Free Fire', 'Live Streaming'],
  },
  {
    slug: 'rooter-multi-year-journey', eyebrow: 'ROOTER / YEARS', title: 'Two to three years of live streaming',
    summary: 'The Rooter chapter grew into a long-running live-streaming period lasting roughly two to three years.',
    body: ['Streaming consistently for roughly two to three years created the foundation for everything that followed: live audience interaction, community habits, platform knowledge and the discipline to keep showing up.'], era: 'Multi-year Rooter chapter', tags: ['Rooter', 'Streaming', 'Community'],
  },
  {
    slug: 'youtube-begins', eyebrow: 'YOUTUBE / BEGINNING', title: 'A new YouTube channel and a new home',
    summary: 'After years of live streaming, a new YouTube channel was opened and Free Fire live streams began there.',
    body: ['The next major move was starting a new YouTube channel and bringing the Free Fire live-streaming journey to YouTube. Rooter and YouTube were then run together instead of treating them as separate worlds.'], era: 'YouTube launch', tags: ['YouTube', 'Free Fire', 'Live'],
  },
  {
    slug: 'five-thousand-and-monetization', eyebrow: 'YOUTUBE / BREAKTHROUGH', title: '5,000 subscribers in one month',
    summary: 'The new YouTube channel reached 5,000 subscribers within roughly one month and was monetized during the same growth phase.',
    body: ['The early YouTube push moved fast. Within roughly one month, the channel reached 5,000 subscribers and was monetized, turning the new platform into a serious long-term creator path.'], era: 'Early YouTube breakthrough', tags: ['YouTube', '5K Subscribers', 'Monetization'],
  },
  {
    slug: 'rooter-moderation-leadership', eyebrow: 'ROOTER / COMMUNITY', title: 'From moderator to Head Moderator',
    summary: 'Alongside streaming and YouTube, the Rooter role expanded through moderation and community responsibilities.',
    body: ['The Rooter journey also moved behind the scenes. Moderation responsibilities grew over time, followed by Head Moderator and Community Intern experiences. Those roles gave a deeper understanding of community operations, people and platform culture.'], era: 'Rooter community chapter', tags: ['Moderation', 'Head Moderator', 'Community Intern'],
  },
  {
    slug: 'college-and-creator-life', eyebrow: 'LIFE / EDUCATION', title: 'Building a creator career while completing college',
    summary: 'The creator journey continued alongside college, with streaming, community work and education running together.',
    body: ['The same period included completing college while maintaining the creator and community responsibilities. It was a parallel chapter rather than a single-track career: education, live streaming, moderation and YouTube all moved forward together.'], era: 'Parallel growth chapter', tags: ['College', 'Creator', 'Community'],
  },
  {
    slug: 'youtube-full-shift', eyebrow: 'YOUTUBE / SHIFT', title: 'Moving the main focus to YouTube',
    summary: 'After the Rooter chapter, YouTube became the primary home for live streaming and creator growth.',
    body: ['Eventually the focus shifted fully toward YouTube. The experience gained from Rooter stayed important, but YouTube became the main platform for live streams, videos and the next stage of the UltraOP identity.'], era: 'YouTube main era', tags: ['YouTube', 'Live Streaming', 'UltraOP'],
  },
  {
    slug: 'minecraft-transition', eyebrow: 'MINECRAFT / NOW', title: 'Learning Minecraft and building the next era',
    summary: 'After the Free Fire live-streaming chapter, Minecraft became the current game focus.',
    body: ['Minecraft became the next game to learn and build around. Today, Minecraft live streams continue on the main channel, with Minecraft-related videos appearing alongside the live content.'], era: 'Current era', tags: ['Minecraft', 'YouTube Live', 'Gaming'],
  },
  {
    slug: 'roblox-next', eyebrow: 'NEXT / ROBLOX', title: 'The next expansion: Roblox',
    summary: 'Roblox is planned as another part of the wider UltraOP gaming universe.',
    body: ['The roadmap is not limited to one game. Roblox is planned as a future expansion, while the main live identity continues to be anchored around Minecraft and the wider creator network.'], era: 'Next expansion', tags: ['Roblox', 'Gaming', 'Expansion'],
  },
  {
    slug: 'minecraft-story-mode', eyebrow: 'NEXT / STORYTELLING', title: 'From live gameplay to Minecraft stories',
    summary: 'The next content format is designed around Minecraft story-mode videos on an alternate channel.',
    body: ['The plan is to keep the main channel focused on Minecraft live streams while developing an alternate-channel format for Minecraft story videos: stronger concepts, narrative structure, production and memorable moments.'], era: 'Upcoming format', tags: ['Minecraft', 'Storytelling', 'Video Production'],
  },
  {
    slug: 'technology-projects', eyebrow: 'TECH / BUILDER', title: 'The creator who also likes building technology',
    summary: 'Beyond content, the journey includes building personal websites and technology projects.',
    body: ['Technology has become another creative outlet. Personal website projects such as ultrapi.in and newer Minecraft-mod and WhatsApp-related projects are part of the broader builder side of the creator identity.'], era: 'Builder chapter', tags: ['Technology', 'Web Development', 'Projects'],
  },
  {
    slug: 'creator-appearances', eyebrow: 'CREATOR NETWORK / APPEARANCES', title: 'Showing up in other creators’ videos',
    summary: 'The UltraOP journey has also crossed into appearances in videos from other YouTubers.',
    body: ['Creator work is not always contained inside one channel. Appearances in other YouTubers’ videos are another part of the journey and a natural extension of building relationships across the gaming creator community.'], era: 'Creator network', tags: ['YouTube', 'Creators', 'Collaborations'],
  },
  {
    slug: 'next-ultraop-era', eyebrow: 'FUTURE / ULTRAOP', title: 'The next chapter: Minecraft, PUBG, FPS and storytelling',
    summary: 'The long-term direction combines live Minecraft with PUBG, FPS and story-led video formats across the network.',
    body: ['The next UltraOP chapter is broader than a single game. Minecraft live streams remain central, while future PUBG and FPS ideas can become story-driven videos on the wider channel network. The goal is to combine gaming, storytelling, technology and community into one creator universe.'], era: 'Future chapter', tags: ['Minecraft', 'PUBG', 'FPS', 'Storytelling', 'UltraOP'],
  },
];
