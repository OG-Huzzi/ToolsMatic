const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const replacement = `<section class="section home-about" aria-labelledby="about-toolsmatic">
      <h2 id="about-toolsmatic">A practical toolkit for everyday web work</h2>
      <p>ToolsMatic brings focused browser tools together for writing, code, data, PDFs, images, and quick everyday tasks. Start with the job in front of you, get the result, and move on—no account or installation required.</p>
      <p>Many file and text tools work locally in your browser. That means the file you choose is processed on your device rather than sent to a ToolsMatic server. Check each tool's notes before using sensitive information.</p>
    </section>

    <section class="home-guide" aria-labelledby="home-guide-title">
      <h2 id="home-guide-title">Find the right tool faster</h2>
      <p>Use the search field above for a task such as “compress PDF,” “format JSON,” or “check colour contrast.” Browse by category when you want to explore, and save the tools you return to most often.</p>
      <div class="home-workflow-grid">
        <article>
          <h3>Write and edit</h3>
          <p>Count a draft, compare revisions, clean text, or preview Markdown.</p>
          <a href="tools/word-counter.html">Open Word Counter</a>
        </article>
        <article>
          <h3>Build and validate</h3>
          <p>Format JSON, test regex, generate IDs, and prepare data for a project.</p>
          <a href="tools/json-formatter.html">Open JSON Formatter</a>
        </article>
        <article>
          <h3>Work with files</h3>
          <p>Compress images, organise PDFs, and convert common formats in your browser.</p>
          <a href="tools/compress-pdf.html">Open PDF Compressor</a>
        </article>
      </div>
    </section>

    <section class="home-faq" aria-labelledby="home-faq-title">`;

const next = html.replace(
  /<section class="section home-about" aria-labelledby="about-toolsmatic">[\s\S]*?<section class="home-faq" aria-labelledby="home-faq-title">/,
  replacement
);

if (next === html) {
  throw new Error('Could not find the homepage content block to streamline.');
}

fs.writeFileSync(file, next, 'utf8');
console.log('Streamlined homepage support content.');
