const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outTools = path.join(root, 'tools');
const today = '2026-05-16';
const site = 'https://toolsmatic.me';
const adBlock = `<section class="ad-slot ad-slot-primary pdf-ad-slot" aria-label="Advertisement">
      <script>atOptions={'key':'e61a3745429623f25315f86052a3ab7b','format':'iframe','height':90,'width':728,'params':{}};</script>
      <script src="https://fixesconsessionconsession.com/e61a3745429623f25315f86052a3ab7b/invoke.js"></script>
    </section>`;

const mainFaqs = [
  ['How does the team balancer work?', 'The tool sorts players by skill, then distributes them with a snake draft pattern so strong and developing players are spread across the teams instead of stacked together.'],
  ['Is the Team Balancer free?', 'Yes. The Team Balancer is free to use in your browser with no account, no install, and no server-side processing.'],
  ['Does it upload player data anywhere?', 'No. Player names, skill levels, generated teams, and manual adjustments stay inside your browser. Nothing is sent to a ToolsMatic server.'],
  ['How many players can it handle?', 'It works well for small pickup games, classrooms, hackathons, esports lobbies, and larger groups. Browser performance depends on the device, but normal team-building lists are handled easily.'],
  ['Can I manually adjust teams?', 'Yes. After generation, drag players between team cards to make manual changes while the average skill and balance score update.'],
  ['What is a snake draft?', 'A snake draft assigns ranked players forward through teams and then reverses direction each round, which helps balance the first picks against later picks.'],
  ['Can I use it for sports?', 'Yes. It is useful for basketball, soccer, cricket, volleyball, gym classes, PE groups, training drills, and casual sports sessions.'],
  ['Can I download the results?', 'Yes. You can copy the teams, download a text file, or export a PNG image of the balanced team list.']
];

function jsonLd(data) {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;
}

function head({ title, description, slug, keywords }) {
  const url = `${site}/tools/${slug}`;
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${site}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/team-balancer.css">
  <script src="/assets/site.js" defer></script>`;
}

function shell({ title, description, slug, keywords, h1, body, scripts = '', schema = [] }) {
  return `<!DOCTYPE html>
<html lang="en">
${head({ title, description, slug, keywords })}
  ${schema.map(jsonLd).join('\n  ')}
</head>
<body>
  <header>
    <div class="nav">
      <a class="brand" href="/">ToolsMatic</a>
      <div class="nav-links">
        <a href="/" class="nav-btn">All tools</a>
        <button id="theme-toggle" class="theme-toggle" title="Toggle dark/light mode">&#127769;</button>
      </div>
    </div>
  </header>
  <main class="site-main">
    <nav class="home-breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <a href="/">Tools</a>
      <span>/</span>
      <strong>${h1}</strong>
    </nav>
    <section class="hero">
      <h1>${h1}</h1>
      ${adBlock}
      <p>${description}</p>
    </section>
    ${body}
  </main>
  <footer>
    ToolsMatic &middot; Fast, privacy-first utilities for the web. &middot; <a href="/terms.html">Terms</a> &middot; <a href="/privacy.html">Privacy</a> &middot; <a href="/contact.html">Contact</a>
  </footer>
  ${scripts}
</body>
</html>
`;
}

function toolMarkup() {
  return `<section id="team-balancer-app" class="tool-stage team-balancer-shell" data-mode="count">
      <div class="team-balancer-panel">
        <div class="team-balancer-toolbar">
          <div class="team-balancer-card">
            <h2>Add players</h2>
            <div class="team-balancer-form-row">
              <label>Player name
                <input id="player-name" class="team-balancer-input" type="text" placeholder="Type a name and press Enter">
              </label>
              <label>Skill <span id="skill-value">5</span>/10
                <input id="player-skill" type="range" min="1" max="10" value="5">
              </label>
              <button id="add-player" class="team-balancer-btn team-balancer-btn-primary" type="button">Add player</button>
            </div>
            <div id="player-list" class="team-balancer-player-list" aria-live="polite"></div>
          </div>
          <div class="team-balancer-card">
            <h2>Paste a list</h2>
            <p>Paste names separated by lines or commas. Everyone starts with the selected default skill, then you can tune each player.</p>
            <textarea id="bulk-names" class="team-balancer-textarea" placeholder="Alex&#10;Jordan&#10;Sam&#10;Taylor"></textarea>
            <div class="team-balancer-compact-row">
              <label class="team-balancer-field">Default skill
                <select id="bulk-skill" class="team-balancer-select">
                  <option value="3">Beginner 3</option>
                  <option value="5" selected>Average 5</option>
                  <option value="7">Strong 7</option>
                  <option value="9">Elite 9</option>
                </select>
              </label>
              <button id="add-bulk" class="team-balancer-btn" type="button">Add pasted names</button>
            </div>
          </div>
        </div>
      </div>

      <div class="team-balancer-panel">
        <div class="team-balancer-settings">
          <div class="team-balancer-form-row">
            <label>Balance by
              <select id="balance-mode" class="team-balancer-select">
                <option value="count">Number of teams</option>
                <option value="size">Team size</option>
              </select>
            </label>
            <label>Teams
              <input id="team-count" class="team-balancer-input" type="number" min="2" max="20" value="2">
            </label>
            <label>Players per team
              <input id="team-size" class="team-balancer-input" type="number" min="2" max="50" value="5">
            </label>
          </div>
          <div class="team-balancer-actions">
            <button id="generate-teams" class="team-balancer-btn team-balancer-btn-primary" type="button">Generate teams</button>
            <button id="shuffle-teams" class="team-balancer-btn" type="button">Shuffle balance</button>
            <button id="copy-teams" class="team-balancer-btn" type="button">Copy results</button>
            <button id="download-text" class="team-balancer-btn" type="button">Download text</button>
            <button id="download-png" class="team-balancer-btn" type="button">Download PNG</button>
            <button id="clear-all" class="team-balancer-btn team-balancer-btn-danger" type="button">Clear all</button>
          </div>
          <div class="team-balancer-meter">
            <strong>Balance score: <span id="balance-score">0%</span></strong>
            <div class="team-balancer-meter-track"><span id="balance-score-fill" class="team-balancer-meter-fill" style="width:0%"></span></div>
            <p id="team-summary">Players are ready for fair team generation.</p>
          </div>
        </div>
      </div>

      <div id="team-results" class="team-balancer-teams" aria-live="polite"></div>
    </section>`;
}

const mainArticle = `<section class="team-balancer-seo" aria-labelledby="team-balancer-guide">
      <h2 id="team-balancer-guide">Free team balancer with skill levels for fair groups</h2>
      <p>A team balancer is a practical tool for splitting people into fair groups without relying on guesswork, arguments, or random luck. Random team generators are fast, but they can easily create one group full of advanced players and another group full of beginners. That may be funny once, but it is frustrating when the goal is a good game, a useful classroom activity, a balanced hackathon, or a productive training session. ToolsMatic Team Balancer is built for the real version of this problem: people have different skill levels, group sizes change, and organizers still need a quick answer. You can type names one by one, paste a full list, assign every player a skill from 1 to 10, choose the number of teams or the preferred team size, and generate balanced groups in your browser.</p>
      <h3>Why skill-based balancing matters</h3>
      <p>Balanced teams make activities feel fair. In sports, fair teams create closer games, reduce frustration, and help new players improve because they are not trapped on a weak side. In classrooms, balanced groups prevent one table from having all the confident students while another group struggles to start. In corporate sessions, balanced groups help quieter participants get involved instead of letting one high-energy team dominate. In gaming and esports, balance is often the difference between a fun match and a one-sided stomp. A good team maker should consider ability, not just names. That is why this tool places skill level at the center of the workflow. The number is simple enough for anyone to understand, but useful enough to create meaningful balance.</p>
      <h3>How the snake draft algorithm works</h3>
      <p>The tool uses a snake draft because it is one of the easiest balancing methods to explain and one of the most reliable for small and medium groups. First, players are ranked by skill from highest to lowest. The first round assigns players forward through the teams: Team A, Team B, Team C, and so on. The next round reverses direction: Team C, Team B, Team A. This back-and-forth pattern prevents Team A from always receiving the strongest available player in each round. It also keeps high-skill and lower-skill players spread out more evenly than a simple random shuffle. The result is easy to understand, fast to compute, and transparent enough that coaches, teachers, captains, and organizers can trust the output.</p>
      <h3>Who uses a team balancer?</h3>
      <p>Sports coaches can split basketball, soccer, volleyball, cricket, tennis, or training squads into fair sides before practice. Teachers can create classroom groups that avoid putting all high performers together. Youth leaders can split camp activities without wasting time. Corporate facilitators can build workshop teams that mix departments and confidence levels. Hackathon organizers can create balanced squads with designers, developers, writers, and beginners spread across the room. Esports groups can make fair lobbies for Valorant, Fortnite, Rocket League, Counter-Strike, League of Legends, or casual Discord events. Any situation where people need to be split fairly benefits from a skill-based team generator.</p>
      <h3>Why browser-based is better than installing an app</h3>
      <p>Team balancing is often a quick task. You may be standing courtside, in a classroom, on a video call, or in a Discord lobby. Installing an app, creating an account, or sharing player data with a server slows everything down. A browser-based team splitter is better because it opens instantly, works across devices, and does not require setup. ToolsMatic keeps the process fully client-side. The names, skill levels, generated teams, manual drag-and-drop adjustments, copied results, and downloads stay in the browser. That makes it useful for schools, youth groups, workplace events, and anyone who prefers not to upload participant names to an unknown service.</p>
      <h3>Tips for assigning skill levels accurately</h3>
      <p>Use the 1 to 10 scale consistently. A 1 should mean a complete beginner or someone who needs support. A 5 should mean average for the group, not average for the world. A 10 should be reserved for the strongest players in that specific list. If a group includes children and adults, rate people relative to the activity and the participants involved. If you are balancing a game, include real game impact rather than only technical skill. For example, leadership, fitness, communication, and consistency may matter as much as raw ability. For hackathons or classroom tasks, skill can include experience, confidence, creativity, or subject knowledge. The tool cannot know your context, so the quality of the balance improves when the ratings reflect what actually matters.</p>
      <h3>Manual adjustments after generation</h3>
      <p>Algorithms are useful, but organizers still know details that a number cannot capture. Maybe two players should not be on the same team, one participant needs extra support, or a goalkeeper must be moved. That is why the generated team cards support drag and drop. Move a player from one team to another and the average skill score updates immediately. This makes the tool flexible without hiding the math. You get a strong starting point from the snake draft, then can apply human judgment without rebuilding everything manually.</p>
      <h3>Privacy and local processing</h3>
      <p>The Team Balancer does not need a backend. It does not need a database. It does not need accounts. Everything runs in JavaScript inside the browser. That matters because team lists can include student names, employee names, youth sports rosters, or private event groups. Keeping the data local reduces unnecessary risk and makes the tool easier to trust. You can clear the list when finished, copy the result to your clipboard, or download a text or image file for sharing.</p>
      <h3>Comparison with basic random team tools</h3>
      <table class="team-balancer-compare">
        <thead><tr><th>Feature</th><th>ToolsMatic</th><th>RandomLists</th><th>Wheel Decide</th><th>Basic spreadsheet</th></tr></thead>
        <tbody>
          <tr><td>Skill-based balancing</td><td>✓</td><td>×</td><td>×</td><td>✓</td></tr>
          <tr><td>Snake draft distribution</td><td>✓</td><td>×</td><td>×</td><td>×</td></tr>
          <tr><td>Manual drag-and-drop adjustment</td><td>✓</td><td>×</td><td>×</td><td>×</td></tr>
          <tr><td>Copy and download results</td><td>✓</td><td>✓</td><td>×</td><td>✓</td></tr>
          <tr><td>Runs locally in browser</td><td>✓</td><td>×</td><td>×</td><td>✓</td></tr>
        </tbody>
      </table>
    </section>`;

function faqSection(faqs) {
  return `<section class="team-balancer-faq" aria-labelledby="team-balancer-faq-title">
      <h2 id="team-balancer-faq-title">Team Balancer FAQs</h2>
      ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
    </section>`;
}

const schemas = (slug, name, description, faqs, type = 'WebApplication') => {
  const url = `${site}/tools/${slug}`;
  return [
    type === 'WebApplication' ? {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name,
      url,
      description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript and a modern web browser',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    } : {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: name,
      url,
      description,
      author: { '@type': 'Organization', name: 'ToolsMatic' },
      publisher: { '@type': 'Organization', name: 'ToolsMatic' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${site}/` },
        { '@type': 'ListItem', position: 3, name, item: url }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    }
  ];
};

const mainDescription = 'Split players into fair teams by skill level with snake draft balancing, manual drag-and-drop adjustments, copy, PNG export, and private browser-based processing.';
const mainPage = shell({
  title: 'Free Team Balancer with Skill Levels — Split Groups Fairly | ToolsMatic',
  description: mainDescription,
  slug: 'team-balancer.html',
  keywords: 'team balancer, team generator with skill levels, fair team maker, random team generator, snake draft team generator, sports team balancer, classroom team generator, esports team balancer',
  h1: 'Team Balancer with Skill Levels',
  body: `${toolMarkup()}\n    ${mainArticle}\n    ${faqSection(mainFaqs)}`,
  scripts: '<script src="/assets/team-balancer.js" defer></script>',
  schema: schemas('team-balancer.html', 'Team Balancer with Skill Levels', mainDescription, mainFaqs)
});

const pseoPages = [
  {
    slug: 'team-balancer-for-sports.html',
    keyword: 'team balancer for sports teams',
    title: 'Team Balancer for Sports Teams — Fair Lineups by Skill | ToolsMatic',
    audience: 'coaches, captains, PE teachers, and pickup game organizers',
    useCase: 'basketball, soccer, volleyball, cricket, tennis, training drills, and mixed-skill practice games',
    angle: 'Sports teams need balance because one-sided games stop being useful. A fair split keeps energy high, protects beginner confidence, and gives stronger players a real challenge instead of an easy win.'
  },
  {
    slug: 'random-team-generator-skill-level.html',
    keyword: 'random team generator with skill levels',
    title: 'Random Team Generator with Skill Levels — Fairer Than Pure Random | ToolsMatic',
    audience: 'organizers who like the speed of random teams but need smarter distribution',
    useCase: 'quick activities, games, classrooms, camps, clubs, and small competitions',
    angle: 'Pure random generation is simple, but it ignores player strength. Adding skill levels keeps the experience fast while avoiding teams that are accidentally stacked.'
  },
  {
    slug: 'fair-team-maker-online.html',
    keyword: 'fair team maker online free',
    title: 'Fair Team Maker Online Free — Balanced Groups in Your Browser | ToolsMatic',
    audience: 'anyone who needs fair groups without installing an app',
    useCase: 'events, workshops, games, classrooms, community meetups, and online sessions',
    angle: 'A fair team maker should be quick, clear, and private. The goal is not to make a complicated management system; it is to split people fairly and move on.'
  },
  {
    slug: 'team-generator-for-teachers.html',
    keyword: 'team generator for classroom students',
    title: 'Team Generator for Teachers — Balanced Classroom Groups | ToolsMatic',
    audience: 'teachers, tutors, trainers, and school activity leaders',
    useCase: 'class projects, lab groups, debate teams, revision circles, peer learning, and classroom games',
    angle: 'Classroom groups work better when confident students, quiet students, and developing learners are spread across the room instead of clustered by accident.'
  },
  {
    slug: 'esports-team-balancer.html',
    keyword: 'esports team balancer tool',
    title: 'Esports Team Balancer Tool — Fair Gaming Teams by Skill | ToolsMatic',
    audience: 'Discord communities, streamers, tournament hosts, and gaming groups',
    useCase: 'Valorant, Fortnite, Rocket League, Counter-Strike, League of Legends, Minecraft events, and casual custom lobbies',
    angle: 'Gaming sessions fall apart when one side is obviously stronger. Skill-based balancing makes lobbies more competitive without needing a full ranking system.'
  },
  {
    slug: 'team-splitter-groups.html',
    keyword: 'split group into balanced teams',
    title: 'Split a Group into Balanced Teams — Simple Skill-Based Splitter | ToolsMatic',
    audience: 'event organizers, club leaders, teachers, coaches, and workplace facilitators',
    useCase: 'splitting any list of names into fair teams, pods, squads, or groups',
    angle: 'When you need to split a group, the hardest part is not creating teams; it is making sure the teams feel fair once people start working or playing.'
  },
  {
    slug: 'team-balancer-for-hackathons.html',
    keyword: 'team balancer for hackathons',
    title: 'Team Balancer for Hackathons — Fair Project Teams by Skill | ToolsMatic',
    audience: 'hackathon organizers, coding club leaders, bootcamp mentors, and startup event hosts',
    useCase: 'mixing developers, designers, product thinkers, writers, beginners, and experienced builders',
    angle: 'Hackathon teams need more than random names. Balanced groups help every project start with a fair mix of technical, creative, and communication skills.'
  },
  {
    slug: 'corporate-team-builder.html',
    keyword: 'corporate team building activity generator',
    title: 'Corporate Team Building Activity Generator — Balanced Work Groups | ToolsMatic',
    audience: 'HR teams, managers, trainers, facilitators, and event coordinators',
    useCase: 'workshops, offsites, icebreakers, training activities, strategy sessions, and internal competitions',
    angle: 'Corporate team activities feel better when departments, confidence levels, and experience are spread across groups instead of letting one table dominate.'
  },
  {
    slug: 'basketball-team-generator.html',
    keyword: 'basketball team generator by skill',
    title: 'Basketball Team Generator by Skill — Fair Pickup Teams | ToolsMatic',
    audience: 'pickup basketball groups, coaches, gym captains, and school sports organizers',
    useCase: '3v3, 4v4, 5v5, practice scrimmages, gym sessions, and tournament warmups',
    angle: 'Basketball is sensitive to imbalance because one elite scorer or defender can change the entire game. Skill-based team generation keeps pickup runs closer.'
  },
  {
    slug: 'soccer-team-balancer.html',
    keyword: 'soccer team balancer online free',
    title: 'Soccer Team Balancer Online Free — Split Fair Football Sides | ToolsMatic',
    audience: 'soccer coaches, five-a-side captains, PE teachers, and weekend football groups',
    useCase: '5-a-side, 7-a-side, full-field training, school matches, and casual football sessions',
    angle: 'Soccer balance depends on more than names. A fair split spreads strong attackers, defenders, runners, and beginners so the match stays competitive.'
  }
];

function pseoContent(page) {
  const faqs = [
    [`Can I use this for ${page.keyword}?`, `Yes. The main Team Balancer is designed for ${page.useCase}, and it lets you assign skill levels before generating fair groups.`],
    ['Is the tool free?', 'Yes. It is free to use in the browser with no sign-up requirement.'],
    ['Does it use a random algorithm?', 'It can shuffle tied players, but the main distribution uses a snake draft after sorting by skill so the result is more balanced than pure random teams.'],
    ['Can I edit the generated teams?', 'Yes. After generation, you can drag players between teams and rename the teams.'],
    ['Can I save the team list?', 'Yes. You can copy the result, download a text file, or export a PNG image.']
  ];
  const description = `${page.title.replace(' | ToolsMatic', '')}. Use a private browser-based team balancer for ${page.useCase}.`;
  const body = `<section class="team-balancer-pseo">
      <h2>${page.keyword}</h2>
      <p>${page.angle} The ToolsMatic Team Balancer is built for ${page.audience}. It takes the familiar idea of a random team generator and makes it more useful by adding skill levels, snake draft distribution, manual adjustment, team naming, copy support, and downloadable results. The page is still simple enough for a rushed organizer to use in a minute, but the output is much fairer than a random shuffle.</p>
      <p>The process starts with names. You can add participants one at a time or paste a full list. Each person receives a skill rating from 1 to 10. The rating does not need to be perfect; it only needs to be consistent within your group. For ${page.useCase}, think about the traits that actually affect the activity. Speed, experience, confidence, technical ability, communication, fitness, subject knowledge, or leadership can all be part of the score. A 10 should mean one of the strongest people in this specific group, while a 1 should mean someone who needs the most support.</p>
      <p>Once the list is ready, choose whether you want a fixed number of teams or a preferred team size. The tool then sorts players by skill and distributes them using a snake draft. That means the first pass moves from the first team to the last team, then the next pass reverses direction. The pattern keeps high-skill participants from landing together and helps teams end with similar averages. It is transparent, fast, and easy to explain if someone asks how the teams were made.</p>
      <p>For ${page.keyword}, this matters because fairness changes the whole experience. One-sided groups can make beginners feel useless and advanced participants feel bored. Balanced groups create closer games, better collaboration, stronger learning, and less arguing. The tool also shows each team average and an overall balance score, so the organizer can see whether the teams are close. If a human detail matters, such as separating two friends or moving a specialist, drag a player between teams and the numbers update.</p>
      <p>Privacy is another reason to use a browser-based tool. Many team lists include student names, employee names, youth players, or private community members. There is no reason to upload that list just to split it into groups. ToolsMatic runs the team maker locally in your browser. The names, ratings, generated teams, and edits stay on your device. You can clear everything after the activity and no account is required.</p>
      <p>The best way to use this page is to open the main Team Balancer, paste the list, assign quick ratings, generate teams, and share the output. For recurring groups, keep a rough rating note somewhere private so future sessions are even faster. For new groups, ask one coach, teacher, captain, or facilitator to rate the list based on practical ability. Do not overthink the scale. The tool is designed to produce a useful starting point, not to judge people permanently.</p>
      <p><a class="team-balancer-btn team-balancer-btn-primary" href="/tools/team-balancer.html">Open the Team Balancer</a></p>
      <h3>Why this is better than basic random team splitting</h3>
      <p>Basic random tools are acceptable when everyone has nearly the same ability. They become weak when the group has obvious differences. A random draw can accidentally place the strongest people together, and then the organizer has to fix everything manually. ToolsMatic keeps the speed of a random tool but adds enough structure to make the result usable. The skill score is simple, the algorithm is understandable, the output can be edited, and the results can be copied or downloaded.</p>
      <h3>Practical workflow</h3>
      <ol>
        <li>Paste or type the participant names.</li>
        <li>Assign each person a skill level from 1 to 10.</li>
        <li>Choose team count or team size.</li>
        <li>Generate teams with snake draft balancing.</li>
        <li>Drag players if you need a manual adjustment.</li>
        <li>Copy or download the final team list.</li>
      </ol>
    </section>
    ${faqSection(faqs)}`;
  return shell({
    title: page.title,
    description,
    slug: page.slug,
    keywords: `${page.keyword}, team balancer, team generator with skill levels, fair teams, snake draft teams`,
    h1: page.title.replace(' | ToolsMatic', ''),
    body,
    schema: schemas(page.slug, page.title.replace(' | ToolsMatic', ''), description, faqs, 'Article')
  });
}

fs.mkdirSync(outTools, { recursive: true });
fs.writeFileSync(path.join(outTools, 'team-balancer.html'), mainPage, 'utf8');
pseoPages.forEach((page) => fs.writeFileSync(path.join(outTools, page.slug), pseoContent(page), 'utf8'));

const indexPath = path.join(root, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
index = index.replace(/\b150\b/g, '151');
if (!index.includes('tools/team-balancer.html')) {
  const anchor = `<a class="card" href="tools/stopwatch-timer.html">`;
  const start = index.indexOf(anchor);
  const next = index.indexOf('<a class="card"', start + anchor.length);
  const insert = `        <a class="card" href="tools/team-balancer.html">

                          <h3>Team Balancer</h3>

                          <p>Split players into fair teams by skill with snake draft balancing.</p>

                        </a>\n`;
  if (start !== -1 && next !== -1) {
    index = index.slice(0, next) + insert + index.slice(next);
  }
}
fs.writeFileSync(indexPath, index, 'utf8');

const siteJsPath = path.join(root, 'assets', 'site.js');
let siteJs = fs.readFileSync(siteJsPath, 'utf8');
if (!siteJs.includes("/tools/team-balancer.html")) {
  const entry = `    { url: '/tools/team-balancer.html', title: 'Team Balancer', description: 'Split players into fair teams by skill with snake draft balancing, drag-and-drop edits, and export options.', category: 'Everyday' },\n`;
  const marker = `    { url: '/tools/text-diff-checker.html'`;
  const idx = siteJs.indexOf(marker);
  if (idx !== -1) siteJs = siteJs.slice(0, idx) + entry + siteJs.slice(idx);
}
siteJs = siteJs.replace('const HOME_TOOL_COUNT = 150;', 'const HOME_TOOL_COUNT = 151;');
siteJs = siteJs.replace(
  "Everyday: 'everyday timer stopwatch pomodoro focus timezone time zone unit converter measurement productivity reaction reflex'",
  "Everyday: 'everyday timer stopwatch pomodoro focus timezone time zone unit converter measurement productivity reaction reflex team balancer generator group splitter sports classroom esports hackathon corporate basketball soccer snake draft skill fair teams'"
);
if (!siteJs.includes("'Team Balancer':")) {
  const aliasMarker = "    'Text Diff Checker': 'compare text diff changes difference revisions',";
  siteJs = siteJs.replace(aliasMarker, "    'Team Balancer': 'team generator team maker random teams skill levels snake draft groups sports classroom esports hackathon corporate basketball soccer fair teams',\n" + aliasMarker);
}
fs.writeFileSync(siteJsPath, siteJs, 'utf8');

const urls = ['team-balancer.html', ...pseoPages.map((page) => page.slug)].map((slug, index) => ({
  loc: `${site}/tools/${slug}`,
  priority: index === 0 ? '0.9' : '0.65'
}));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, priority }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap-team-balancer.xml'), sitemap, 'utf8');

const mainSitemapPath = path.join(root, 'sitemap.xml');
let mainSitemap = fs.readFileSync(mainSitemapPath, 'utf8');
const addition = urls
  .filter(({ loc }) => !mainSitemap.includes(`<loc>${loc}</loc>`))
  .map(({ loc, priority }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
  .join('\n');
if (addition) {
  mainSitemap = mainSitemap.replace('</urlset>', `${addition}\n</urlset>`);
  fs.writeFileSync(mainSitemapPath, mainSitemap, 'utf8');
}

const robotsPath = path.join(root, 'robots.txt');
let robots = fs.readFileSync(robotsPath, 'utf8');
const sitemapLine = 'Sitemap: https://toolsmatic.me/sitemap-team-balancer.xml';
if (!robots.includes(sitemapLine)) {
  robots = robots.trimEnd() + `\n${sitemapLine}\n`;
  fs.writeFileSync(robotsPath, robots, 'utf8');
}

console.log('Team Balancer tool, pSEO pages, sitemap, homepage card, counts, and search catalog updated.');
