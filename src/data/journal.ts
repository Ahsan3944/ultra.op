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
    body: ["PUBG was the first major chapter in the gaming journey, before the UltraOP name became a wider creator identity. The attraction was not only the last-circle win: every match demanded awareness, map knowledge, loot decisions, positioning and communication.","Competitive play made those small decisions easier to notice. A good landing route, a safer rotation or a timely team call could be as important as aim. Those lessons became useful later when streaming, explaining gameplay and building gaming communities.","This entry is a personal timeline rather than a claim about a single official championship. For verified global title winners, the separate PUBG esports history records each tournament and year with source links."], era: 'Early competitive era', tags: ['PUBG', 'Competitive Gaming', 'Esports'],
  },
  {
    slug: 'competitive-teams', eyebrow: 'ESPORTS / TEAMS', title: 'Multiple teams, multiple competitive chapters',
    summary: 'The competitive phase included playing with multiple teams, including Indian Falcon and Esports Mania, with achievements across that era.',
    body: ["Team environments changed how the game felt. Each roster brought a different communication style, role balance and way of preparing for a match. Indian Falcon and Esports Mania are part of the competitive chapter recalled in the UltraOP story.","Playing with teams teaches skills that rarely appear in a highlight clip: sharing information without flooding voice chat, making a plan after a bad drop, deciding when to disengage, and learning from a loss without blaming one teammate for everything.","That experience also led naturally toward organised matches and community coordination. Tournament placements are listed only when an event and result can be identified; a team association alone is not presented as a championship."], era: 'Competitive chapter', tags: ['Indian Falcon', 'Esports Mania', 'Teams'],
  },
  {
    slug: 'esm-scrims', eyebrow: 'ESM / SCRIMS', title: 'Building the scrim ecosystem',
    summary: 'Esports Mania grew into a Discord-based ecosystem where PUBG and BGMI scrims were organised across T1, T2 and T3 levels.',
    body: ["Esports Mania grew beyond a team name into a Discord-based scrim ecosystem for PUBG and BGMI. Different competitive tiers—T1, T2 and T3—helped make organised matches more accessible to players at different experience levels.","Running a scrim community depends on process: posting schedules, communicating rules, gathering line-ups, keeping matches moving and handling disagreements consistently. It turns competition into a repeatable activity that players can learn from, rather than a one-off custom room.","This chapter is why UltraOP’s esports articles separate the PC PUBG circuit from BGMI’s Indian tournament circuit. The games share a broad battle-royale idea, but results and tournament histories should remain tied to the exact title and event."], era: 'Esports Mania chapter', tags: ['ESM', 'BGMI', 'PUBG', 'Scrims', 'Discord'],
  },
  {
    slug: 'pubg-ban-transition', eyebrow: 'TRANSITION / ROOTER', title: 'PUBG was banned. The platform changed.',
    summary: 'When PUBG was banned in India, the next opportunity came through Rooter.',
    body: ["When PUBG was banned in India, the old routine and its communities had to change. For a gamer whose identity was strongly tied to that period, it meant adapting rather than assuming that the next game or platform would feel identical.","The transition became a turning point: the knowledge gained in PUBG—teamwork, positioning and competitive awareness—could still be carried forward, even when the available game and content format changed.","The next chapter moved toward Rooter and Free Fire. This entry describes the creator’s transition, not a complete policy history of the game; public regulatory or legal details should be checked against reliable historical sources."], era: 'Platform transition', tags: ['PUBG', 'Rooter', 'Transition'],
  },
  {
    slug: 'rooter-free-fire-streaming', eyebrow: 'ROOTER / FREE FIRE', title: 'Learning Free Fire live',
    summary: 'Rooter became the place to stream Free Fire live while learning the game from the ground up.',
    body: ["Free Fire was a new game to learn while live. Rooter gave the creator a place to practise, talk to viewers and show the learning process in real time instead of waiting until every mechanic felt mastered.","Live streaming creates a different kind of pressure from ranked matches alone. The player is also tracking chat, explaining a decision, reacting to wins and losses, and keeping the stream welcoming. These skills become part of a creator’s style just as much as mechanics do.","The aim was not to pretend the learning curve did not exist. It was to improve publicly and build a community around repeated sessions. That experience later helped when the focus shifted toward YouTube and Minecraft."], era: 'Rooter streaming era', tags: ['Rooter', 'Free Fire', 'Live Streaming'],
  },
  {
    slug: 'rooter-multi-year-journey', eyebrow: 'ROOTER / YEARS', title: 'Two to three years of live streaming',
    summary: 'The Rooter chapter grew into a long-running live-streaming period lasting roughly two to three years.',
    body: ["The Rooter chapter continued for roughly two to three years, based on the creator’s own recollection. The time was spent developing a streaming routine, getting comfortable with audience interaction and learning how community features worked on a live platform.","Sticking with a stream schedule teaches consistency. Some sessions bring more chat and momentum than others, but the long-term work is to keep showing up, give viewers a clear reason to return and learn from what actually worked.","Exact dates and unverified performance figures are left out of this article. The important record is the multi-year experience that helped bridge competitive gaming and a more focused creator career."], era: 'Multi-year Rooter chapter', tags: ['Rooter', 'Streaming', 'Community'],
  },
  {
    slug: 'youtube-begins', eyebrow: 'YOUTUBE / BEGINNING', title: 'A new YouTube channel and a new home',
    summary: 'After years of live streaming, a new YouTube channel was opened and Free Fire live streams began there.',
    body: ["YouTube became the next place to build an audience. The initial approach carried the Free Fire live-streaming format over from Rooter, allowing viewers to find streams and clips in a channel environment that could support longer-term discovery.","Running more than one platform at once also introduced practical decisions about stream setup, audience communication, archives and where to put the main creative effort. The channel was not just a place to broadcast; it became a public home for an evolving creator identity.","Later, YouTube became the primary platform. The move set up the next milestone: broadening the network while gradually moving the main live content toward Minecraft."], era: 'YouTube launch', tags: ['YouTube', 'Free Fire', 'Live'],
  },
  {
    slug: 'five-thousand-and-monetization', eyebrow: 'YOUTUBE / BREAKTHROUGH', title: '5,000 subscribers in one month',
    summary: 'The new YouTube channel reached 5,000 subscribers within roughly one month and was monetized during the same growth phase.',
    body: ["The early YouTube growth period moved quickly. According to the creator’s own timeline, the channel reached roughly 5,000 subscribers within about one month and was monetized during that same growth phase.","That milestone made it easier to imagine content creation as a sustained project rather than just an occasional live session. It also brought a new responsibility: treat viewers’ trust carefully, keep channel links accurate and avoid inventing statistics when the platform’s current numbers cannot be confirmed.","This is a creator-provided historical milestone, not a live subscriber count or independent earnings audit. The website deliberately distinguishes reported history from current public metrics."], era: 'Early YouTube breakthrough', tags: ['YouTube', '5K Subscribers', 'Monetization'],
  },
  {
    slug: 'rooter-moderation-leadership', eyebrow: 'ROOTER / COMMUNITY', title: 'From moderator to Head Moderator',
    summary: 'Alongside streaming and YouTube, the Rooter role expanded through moderation and community responsibilities.',
    body: ["The Rooter experience also included work behind the scenes. Moderation responsibilities grew into roles the creator describes as Head Moderator and Community Intern, bringing attention to the way a platform handles conversations and community safety.","A healthy gaming community does not happen only because people enjoy a game. It needs clear expectations, calm decisions, consistent enforcement, useful communication and a fair way to report problems. Moderation is often quiet work, but it strongly affects whether players feel welcome.","Those lessons continue to matter to the UltraOP creator network. Official links should be easy to verify, community claims should be stated accurately and private information should not be requested in exchange for ordinary participation."], era: 'Rooter community chapter', tags: ['Moderation', 'Head Moderator', 'Community Intern'],
  },
  {
    slug: 'college-and-creator-life', eyebrow: 'LIFE / EDUCATION', title: 'Building a creator career while completing college',
    summary: 'The creator journey continued alongside college, with streaming, community work and education running together.',
    body: ["Education and gaming developed alongside one another. College, creator work, streaming and community responsibilities each required time and attention, so the period was about balancing several commitments rather than following a single uninterrupted path.","That balance can be difficult for creators: recording and streaming have visible start times, while preparation, moderation, troubleshooting and editing often happen out of frame. Consistency depends on building a routine that makes room for both study and creative work.","This article keeps the focus on the experience rather than publishing unnecessary personal details. It is part of the broader UltraOP story because a creator’s development includes the work outside a stream as well as what viewers see on screen."], era: 'Parallel growth chapter', tags: ['College', 'Creator', 'Community'],
  },
  {
    slug: 'youtube-full-shift', eyebrow: 'YOUTUBE / SHIFT', title: 'Moving the main focus to YouTube',
    summary: 'After the Rooter chapter, YouTube became the primary home for live streaming and creator growth.',
    body: ["Eventually YouTube became the main platform, rather than one of two active homes. That shift gave the creator network a clearer centre for live sessions, videos, archives and the next stage of experimentation.","The move did not erase what came before. Live audience interaction, moderation and consistency from the Rooter chapter still influenced how streams were run, while YouTube introduced its own discovery patterns and channel-management decisions.","Today the public network lists different channels for different interests. The site links to the channels directly and avoids claiming that a profile is currently live unless the platform itself confirms it."], era: 'YouTube main era', tags: ['YouTube', 'Live Streaming', 'UltraOP'],
  },
  {
    slug: 'minecraft-transition', eyebrow: 'MINECRAFT / NOW', title: 'Learning Minecraft and building the next era',
    summary: 'After the Free Fire live-streaming chapter, Minecraft became the current game focus.',
    body: ["Minecraft became the current main game focus after the Free Fire live-streaming chapter. The game supports a much wider mix of creator formats: survival, building, challenge rules, multiplayer systems, technical experiments and stories that continue across episodes.","For live content, Minecraft offers room for audience interaction and unscripted moments. For edited videos, the same sandbox can support a clear concept, rising stakes and a satisfying ending. The difference is often the structure around the gameplay, not just the game itself.","The next ambition is to combine that freedom with consistent storytelling. The Minecraft version library on this site also helps viewers and server owners check which version a feature or compatibility note refers to."], era: 'Current era', tags: ['Minecraft', 'YouTube Live', 'Gaming'],
  },
  {
    slug: 'roblox-next', eyebrow: 'NEXT / ROBLOX', title: 'The next expansion: Roblox',
    summary: 'Roblox is planned as another part of the wider UltraOP gaming universe.',
    body: ["Roblox is planned as a future expansion of the UltraOP network rather than a claim that every planned format is already published. The aim is to explore new multiplayer experiences without losing the identity that viewers recognise across the creator’s channels.","A thoughtful expansion begins with a clear audience promise: what kind of game will appear, what makes the video worth watching, and where it fits in the wider channel network? That helps variety content feel deliberate instead of random.","New formats will be added to the official channel directory when their public destinations and content focus are ready to confirm."], era: 'Next expansion', tags: ['Roblox', 'Gaming', 'Expansion'],
  },
  {
    slug: 'minecraft-story-mode', eyebrow: 'NEXT / STORYTELLING', title: 'From live gameplay to Minecraft stories',
    summary: 'The next content format is designed around Minecraft story-mode videos on an alternate channel.',
    body: ["Story-led Minecraft videos are planned as a distinct format from live gameplay. They can have a central mystery, character goals, alliances, reversals and consequences that build from one episode to the next.","The production challenge is to make the story understandable even to a viewer seeing one episode first. A strong opening establishes the problem, later scenes answer one question while raising another, and the ending gives the viewer a clear reason to continue.","This is a planned direction, not a claim that every episode or season described in creator notes has already launched. Published series and their official playlists should be linked here once they are public."], era: 'Upcoming format', tags: ['Minecraft', 'Storytelling', 'Video Production'],
  },
  {
    slug: 'technology-projects', eyebrow: 'TECH / BUILDER', title: 'The creator who also likes building technology',
    summary: 'Beyond content, the journey includes building personal websites and technology projects.',
    body: ["Technology is another part of the creator’s work. Website improvements, Minecraft tools, server systems and production workflows share a common goal: reduce repetitive effort and make creative projects easier to organise.","Building a tool also means being precise about its current state. A prototype, a private utility and a public release are different things, and the website should label them accordingly instead of promising that a project is available before a public link exists.","This builder mindset supports the content work: better planning, consistent assets, repeatable recording steps and clearer notes can give more time back to editing and storytelling."], era: 'Builder chapter', tags: ['Technology', 'Web Development', 'Projects'],
  },
  {
    slug: 'creator-appearances', eyebrow: 'CREATOR NETWORK / APPEARANCES', title: 'Showing up in other creators’ videos',
    summary: 'The UltraOP journey has also crossed into appearances in videos from other YouTubers.',
    body: ["Creator work sometimes crosses the boundaries of a single channel. Appearing in another YouTuber’s video can introduce a creator to a new audience and give a community a moment to recognise someone outside their usual upload format.","These appearances should be documented carefully. A link, upload date and the role played in the video help readers verify the reference; a creator name alone is not enough to imply an endorsement or a formal partnership.","This entry will be strengthened with direct public video references as they are confirmed. Until then, it records the wider idea without inventing collaborators, episode names or view counts."], era: 'Creator network', tags: ['YouTube', 'Creators', 'Collaborations'],
  },
  {
    slug: 'next-ultraop-era', eyebrow: 'FUTURE / ULTRAOP', title: 'The next chapter: Minecraft, PUBG, FPS and storytelling',
    summary: 'The long-term direction combines live Minecraft with PUBG, FPS and story-led video formats across the network.',
    body: ["The next UltraOP chapter brings together Minecraft live streams, future PUBG and FPS ideas, technology projects and story-led formats. Minecraft remains the current focus, while new game formats are treated as planned until a published series confirms them.","The goal is to make the wider network feel connected. Live streams can build familiarity with a world and its characters; edited videos can turn a single idea into a compact story; development projects can provide new mechanics, tools or behind-the-scenes material.","The long-term direction is a creator universe that values suspense, friendships, competition and experimentation without losing clarity about what is current, what is planned and what is historical."], era: 'Future chapter', tags: ['Minecraft', 'PUBG', 'FPS', 'Storytelling', 'UltraOP'],
  },
];
