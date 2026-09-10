export type JournalEntry = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string[];
  era: string;
  tags: string[];
};

// Dates are intentionally left as eras until the creator supplies exact dates.
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'free-fire-esports-beginning',
    eyebrow: 'ORIGIN / FREE FIRE',
    title: 'Before the creator era: competitive Free Fire',
    summary: 'The first chapter was built around playing Free Fire seriously and learning the competitive side of gaming.',
    body: ['Free Fire was where the competitive instinct became part of the journey. The focus was not only on playing, but on understanding the game, the community and the culture around competitive gaming.'],
    era: 'Early chapter',
    tags: ['Free Fire', 'Esports', 'Gaming'],
  },
  {
    slug: 'rooter-streaming-start',
    eyebrow: 'ROOTER / STREAMING',
    title: 'The first move into live streaming',
    summary: 'After the Free Fire esports chapter changed direction, an opportunity opened to start streaming on Rooter.',
    body: ['That opportunity became the bridge from player to broadcaster. Live streaming introduced a different relationship with gaming: talking to viewers, building a routine and creating moments in real time.'],
    era: 'Rooter chapter',
    tags: ['Rooter', 'Live', 'Streaming'],
  },
  {
    slug: 'rooter-moderation',
    eyebrow: 'ROOTER / COMMUNITY',
    title: 'From streamer to moderator',
    summary: 'The Rooter journey expanded beyond streaming into moderation and community responsibility.',
    body: ['Over a long stretch of the Rooter era, the role expanded into moderation. Community work meant helping conversations stay healthy, supporting users and understanding how a large gaming platform actually operates behind the scenes.'],
    era: 'Multi-year chapter',
    tags: ['Rooter', 'Moderation', 'Community'],
  },
  {
    slug: 'head-moderator-community-intern',
    eyebrow: 'ROOTER / ROLES',
    title: 'Head Moderator & Community Intern',
    summary: 'Different responsibilities inside the platform created a deeper understanding of community operations.',
    body: ['At different points, the work included Head Moderator responsibilities and a Community Intern role. These experiences shaped the community-first side of UltraOP and taught lessons that still influence how the creator thinks about audiences today.'],
    era: 'Rooter leadership chapter',
    tags: ['Head Moderator', 'Community Intern', 'Leadership'],
  },
  {
    slug: 'rooter-downfall-and-exit',
    eyebrow: 'ROOTER / TRANSITION',
    title: 'Leaving Rooter and choosing the next platform',
    summary: 'As the platform entered a difficult period, the journey moved toward a new home for live content.',
    body: ['The Rooter chapter eventually came to an end. Leaving was not the end of live streaming; it became the reason to rebuild the same creator energy somewhere with a longer-term path.'],
    era: 'Transition',
    tags: ['Rooter', 'Transition', 'Creator'],
  },
  {
    slug: 'youtube-shift',
    eyebrow: 'YOUTUBE / SHIFT',
    title: 'Moving the live journey to YouTube',
    summary: 'YouTube became the next home for live streams and the foundation for a wider creator network.',
    body: ['The move to YouTube changed the workflow from simply going live to building an owned library of videos, streams, shorts and stories. It also made the creator identity more scalable across channels.'],
    era: 'YouTube chapter',
    tags: ['YouTube', 'Live', 'Creator'],
  },
  {
    slug: 'free-fire-youtube-live',
    eyebrow: 'YOUTUBE / FREE FIRE',
    title: 'Free Fire live streams on YouTube',
    summary: 'Free Fire remained a major part of the early YouTube live-streaming chapter.',
    body: ['The familiar game moved with the creator to YouTube. Live Free Fire sessions became a way to keep the community close while the wider UltraOP identity continued to develop.'],
    era: 'Free Fire YouTube era',
    tags: ['Free Fire', 'YouTube Live', 'Community'],
  },
  {
    slug: 'minecraft-era',
    eyebrow: 'MINECRAFT / NOW',
    title: 'Building the Minecraft chapter',
    summary: 'The content direction is now expanding into Minecraft and a more story-led style of gaming.',
    body: ['Minecraft is the current continuation of the gaming journey. The goal is to move beyond raw gameplay and build stronger concepts, stories, challenges and moments that can live as complete videos.'],
    era: 'Current era',
    tags: ['Minecraft', 'Storytelling', 'YouTube'],
  },
  {
    slug: 'next-fps-storytelling-era',
    eyebrow: 'NEXT / FPS + STORY',
    title: 'The next UltraOP format',
    summary: 'The next phase is planned around Minecraft, PUBG and FPS-style storytelling with stronger production.',
    body: ['The direction ahead is broader: Minecraft, PUBG and FPS content can sit inside the same creator universe when the story is strong enough. The next generation of videos is being shaped around narrative, cinematic presentation and memorable creator-led moments.'],
    era: 'Next chapter',
    tags: ['PUBG', 'Minecraft', 'FPS', 'Storytelling'],
  },
];
