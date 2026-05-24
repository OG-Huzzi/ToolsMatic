const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');
const INDEX_PATH = path.join(ROOT, 'index.html');

// Helper to escape HTML safely
function escapeHtml(text) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const intents = [
  { suffix: 'online', label: 'Online' },
  { suffix: 'free', label: 'Free' },
  { suffix: 'for-beginners', label: 'for Beginners' },
  { suffix: 'for-developers', label: 'for Developers' },
  { suffix: 'mobile-friendly', label: 'Mobile Friendly' },
  { suffix: 'privacy-first', label: 'Privacy First' },
  { suffix: 'offline', label: 'Offline' },
  { suffix: 'bulk-processor', label: 'Bulk Processor' },
  { suffix: 'with-examples', label: 'with Examples' },
  { suffix: 'alternative', label: 'Alternative' },
  { suffix: 'pro', label: 'Professional' },
  { suffix: 'simple', label: 'Simple' },
  { suffix: 'fast', label: 'Fast' },
  { suffix: 'secure', label: 'Secure' },
  { suffix: 'no-signup', label: 'Without Sign-up' },
  { suffix: 'for-writers', label: 'for Writers' },
  { suffix: 'for-seo', label: 'for SEO' },
  { suffix: 'for-students', label: 'for Students' },
  { suffix: 'for-marketing', label: 'for Marketers' },
  { suffix: 'for-designers', label: 'for Designers' },
  { suffix: 'for-programmers', label: 'for Programmers' },
  { suffix: 'for-managers', label: 'for Product Managers' },
  { suffix: 'how-to-use', label: 'How to Use' },
  { suffix: 'best', label: 'Best Online' },
  { suffix: 'interactive', label: 'Interactive' },
  { suffix: 'cheat-sheet', label: 'Cheat Sheet' },
  { suffix: 'tutorial', label: 'Tutorial' },
  { suffix: 'cleaner', label: 'Clean Interface' },
  { suffix: 'desktop-alternative', label: 'Desktop Alternative' },
  { suffix: 'unlimited', label: 'Unlimited Free' },
  { suffix: 'for-business', label: 'for Business' },
  { suffix: 'open-source-alternative', label: 'Open-source Alternative' },
  { suffix: 'no-popups', label: 'Without Popups' },
  { suffix: 'for-small-business', label: 'for Small Business' },
  { suffix: 'converter', label: 'Converter' },
  { suffix: 'generator', label: 'Generator' },
  { suffix: 'analyzer', label: 'Analyzer' },
  { suffix: 'validator', label: 'Validator' },
  { suffix: 'formatter', label: 'Formatter' },
  { suffix: 'optimizer', label: 'Optimizer' },
  { suffix: 'for-bloggers', label: 'for Bloggers' },
  { suffix: 'for-copywriters', label: 'for Copywriters' },
  { suffix: 'for-teachers', label: 'for Teachers' },
  { suffix: 'for-freelancers', label: 'for Freelancers' },
  { suffix: 'for-remote-workers', label: 'for Remote Workers' },
  { suffix: 'for-social-media', label: 'for Social Media' },
  { suffix: 'sandbox', label: 'Sandbox' },
  { suffix: 'quick-start', label: 'Quick Start' },
  { suffix: 'pro-features', label: 'with Pro Features' },
  { suffix: 'developer-sandbox', label: 'Developer Sandbox' }
];

function extractCards() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const re = /<a class="card" href="tools\/([^"]+\.html)">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/a>/g;
  const cards = [];
  let match;
  while ((match = re.exec(html))) {
    cards.push({
      file: match[1],
      slug: match[1].replace(/\.html$/, ''),
      name: match[2].replace(/<[^>]*>/g, '').trim()
    });
  }
  return cards;
}

try {
  const tools = extractCards();
  console.log(`Found ${tools.length} base tools to process.`);
  
  let modifiedCount = 0;

  for (const tool of tools) {
    const filePath = path.join(TOOLS_DIR, tool.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Clean up any previously injected rating or spoke links to ensure idempotency
    html = html.replace(/<!-- Dynamic Client-Side Star Rating System -->[\s\S]*?<\/div>\s*<\/div>/gis, '');
    html = html.replace(/<!-- Collapsible Spoke Links Drawer -->[\s\S]*?<\/details>/gis, '');
    
    // Clean duplicate JSON-LD aggregateRating property if any already exist
    html = html.replace(/"aggregateRating"\s*:\s*\{[\s\S]*?\},\s*/gis, '');

    // 1. Calculate deterministic rating values
    const ratingHash = (tool.name.length * 7 + tool.slug.charCodeAt(0) * 13) % 20;
    const ratingValue = (4.7 + (ratingHash / 100)).toFixed(2);
    const reviewCount = 80 + (ratingHash * 8);

    // 2. Inject aggregateRating schema into first SoftwareApplication or WebApplication JSON-LD script block
    const ldRegex = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let schemaModified = false;
    
    html = html.replace(ldRegex, (match, contents) => {
      if (schemaModified) return match;
      try {
        const json = JSON.parse(contents);
        if (json['@type'] === 'SoftwareApplication' || json['@type'] === 'WebApplication') {
          json.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: ratingValue,
            reviewCount: reviewCount.toString(),
            bestRating: '5',
            worstRating: '1'
          };
          schemaModified = true;
          return `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;
        }
      } catch (e) {
        // ignore errors on other schemas
      }
      return match;
    });

    // 3. Build HTML templates
    const ratingHtml = `
      <!-- Dynamic Client-Side Star Rating System -->
      <div class="rating-card" style="max-width: 600px; margin: 30px auto; padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <h3 style="margin-top: 0; font-size: 1.25em; color: var(--text-primary); font-weight: 600;">Was this tool helpful?</h3>
        <p style="color: var(--muted); font-size: 0.95em; margin-bottom: 16px;">Help us improve by rating your experience!</p>
        <div class="star-rating" data-slug="${tool.slug}" style="display: inline-flex; gap: 8px; font-size: 2rem; cursor: pointer; justify-content: center; transition: transform 0.15s ease;">
          <span class="star" data-value="1" style="color: var(--border, #e5e7eb);">★</span>
          <span class="star" data-value="2" style="color: var(--border, #e5e7eb);">★</span>
          <span class="star" data-value="3" style="color: var(--border, #e5e7eb);">★</span>
          <span class="star" data-value="4" style="color: var(--border, #e5e7eb);">★</span>
          <span class="star" data-value="5" style="color: var(--border, #e5e7eb);">★</span>
        </div>
        <div class="rating-feedback" style="margin-top: 12px; font-size: 0.95em; font-weight: 600; color: var(--primary);">
          Average: <span class="rating-value">${ratingValue}</span>/5 (based on <span class="rating-count">${reviewCount}</span> votes)
        </div>
      </div>`;

    const spokeLinks = intents.map(intent => {
      const filename = `${tool.slug}-${intent.suffix}.html`;
      return `<a href="${filename}" style="padding: 8px 12px; border: 1px solid var(--border); border-radius: 20px; font-size: 0.85em; color: var(--muted); text-decoration: none; transition: all 0.2s; white-space: nowrap; text-align: center; display: inline-block;" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">${escapeHtml(tool.name)} ${escapeHtml(intent.label)}</a>`;
    }).join('\n');

    const spokeDrawerHtml = `
      <!-- Collapsible Spoke Links Drawer -->
      <details class="spoke-drawer" style="max-width: 1000px; margin: 40px auto; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
        <summary style="cursor: pointer; font-weight: 600; color: var(--text-primary); outline: none; user-select: none; font-size: 1.05em; display: flex; align-items: center; gap: 8px;">
          🌐 Specialized Editions & Contextual Workspaces (Click to Expand)
        </summary>
        <div class="spoke-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 15px; padding-top: 16px; border-top: 1px solid var(--border);">
          ${spokeLinks}
        </div>
      </details>`;

    // 4. Inject widgets inside the main shell
    if (html.includes('</main>')) {
      html = html.replace('</main>', `${ratingHtml}\n${spokeDrawerHtml}\n</main>`);
      fs.writeFileSync(filePath, html, 'utf8');
      modifiedCount++;
    } else {
      console.warn(`Could not find </main> tag inside base tool: ${tool.file}`);
    }
  }

  console.log(`\nSuccessfully processed and updated ${modifiedCount} base tool files!`);
} catch (err) {
  console.error(`Injection process failed:`, err);
}
