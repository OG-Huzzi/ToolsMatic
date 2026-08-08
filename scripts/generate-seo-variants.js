const fs = require('fs');
const path = require('path');

const config = [
  {
    baseTool: 'json-formatter.html',
    variants: [
      { slug: 'json-pretty-print', title: 'JSON Pretty Print Online | Fast & Free JSON Prettifier', desc: 'Instantly pretty print, format, and validate your JSON data online.', h1: 'JSON Pretty Print' },
      { slug: 'json-cleaner', title: 'Free JSON Cleaner | Fix & Clean Broken JSON Online', desc: 'Clean, format, and fix broken JSON strings instantly.', h1: 'JSON Cleaner' },
      { slug: 'format-json-online', title: 'Format JSON Online | Free Professional JSON Formatter', desc: 'The best way to format JSON online securely in your browser.', h1: 'Format JSON Online' },
      { slug: 'json-validator-tool', title: 'JSON Validator Tool | Validate JSON Against Schema', desc: 'A fast, client-side JSON validator to find syntax errors.', h1: 'JSON Validator Tool' },
      { slug: 'beautify-json', title: 'Beautify JSON | Online JSON Beautifier', desc: 'Beautify ugly, minified JSON into readable, indented formats.', h1: 'Beautify JSON' },
      { slug: 'json-parser-online', title: 'JSON Parser Online | Parse & View JSON', desc: 'Parse and visualize nested JSON data structures easily.', h1: 'JSON Parser Online' }
    ]
  },
  {
    baseTool: 'password-generator.html',
    variants: [
      { slug: 'strong-password-generator', title: 'Strong Password Generator | Create Secure Passwords', desc: 'Generate strong, random, secure passwords with symbols and numbers.', h1: 'Strong Password Generator' },
      { slug: 'random-password-generator', title: 'Random Password Generator | Free Secure Passwords', desc: 'Create truly random passwords instantly to secure your accounts.', h1: 'Random Password Generator' },
      { slug: 'secure-password-maker', title: 'Secure Password Maker | High-Entropy Passwords', desc: 'Generate uncrackable, high-entropy passwords offline.', h1: 'Secure Password Maker' },
      { slug: 'generate-password-online', title: 'Generate Password Online | Fast & Private', desc: 'Generate secure passwords completely client-side. No data sent to servers.', h1: 'Generate Password Online' },
      { slug: 'wifi-password-generator', title: 'WiFi Password Generator | WPA2/WPA3 Keys', desc: 'Generate secure 63-character keys for your WiFi networks.', h1: 'WiFi Password Generator' },
      { slug: 'memorable-password-generator', title: 'Memorable Password Generator | Secure Passphrases', desc: 'Generate secure but easy-to-remember passphrases.', h1: 'Memorable Password Generator' }
    ]
  },
  {
    baseTool: 'word-counter.html',
    variants: [
      { slug: 'online-word-count', title: 'Online Word Count Tool | Count Words & Characters', desc: 'A fast, free online word count tool for essays and articles.', h1: 'Online Word Count' },
      { slug: 'essay-word-counter', title: 'Essay Word Counter | Track Word Limits', desc: 'Count your essay words and check reading time easily.', h1: 'Essay Word Counter' },
      { slug: 'word-counter-tool', title: 'Word Counter Tool | Free Text Analyzer', desc: 'Analyze text, count words, and calculate speaking time.', h1: 'Word Counter Tool' },
      { slug: 'count-words-online', title: 'Count Words Online | Fast Character Counter', desc: 'Instantly count words in your clipboard without uploading.', h1: 'Count Words Online' },
      { slug: 'text-length-calculator', title: 'Text Length Calculator | Word & Character Stats', desc: 'Calculate the exact length of your text documents.', h1: 'Text Length Calculator' },
      { slug: 'reading-time-calculator', title: 'Reading Time Calculator | Estimate Reading Speed', desc: 'Estimate how long it will take to read an article or speech.', h1: 'Reading Time Calculator' }
    ]
  },
  {
    baseTool: 'character-counter.html',
    variants: [
      { slug: 'character-count-tool', title: 'Character Count Tool | Text Length Calculator', desc: 'Check your character count limits for Twitter, SMS, or SEO.', h1: 'Character Count Tool' },
      { slug: 'letter-counter', title: 'Letter Counter | Count Letters & Spaces', desc: 'Count letters, spaces, and punctuation instantly in your browser.', h1: 'Letter Counter' },
      { slug: 'twitter-character-counter', title: 'Twitter Character Counter | 280 Limit Check', desc: 'Ensure your tweets fit perfectly within the 280 character limit.', h1: 'Twitter Character Counter' },
      { slug: 'sms-length-calculator', title: 'SMS Length Calculator | 160 Char Checker', desc: 'Check if your message fits in a standard 160-character SMS.', h1: 'SMS Length Calculator' },
      { slug: 'seo-title-length-checker', title: 'SEO Title Length Checker | 60 Char Limit', desc: 'Check if your SEO title tag fits perfectly in Google search results.', h1: 'SEO Title Length Checker' },
      { slug: 'count-characters-online', title: 'Count Characters Online | Live Text Stats', desc: 'Get live character and letter counts as you type.', h1: 'Count Characters Online' }
    ]
  },
  {
    baseTool: 'jwt-inspector.html',
    variants: [
      { slug: 'jwt-decoder-online', title: 'JWT Decoder Online | Inspect & Decode JSON Web Tokens', desc: 'Decode JWTs safely in your browser. Inspect offline without sending tokens to a server.', h1: 'JWT Decoder Online' },
      { slug: 'decode-jwt', title: 'Decode JWT | Free Local JWT Debugger', desc: 'Easily decode JSON Web Tokens to read their payload. 100% client-side.', h1: 'Decode JWT' },
      { slug: 'jwt-payload-viewer', title: 'JWT Payload Viewer | Read Claims Instantly', desc: 'View JWT payloads and claims instantly and securely.', h1: 'JWT Payload Viewer' },
      { slug: 'jwt-header-inspector', title: 'JWT Header Inspector | Verify Token Algo', desc: 'Inspect JWT headers to verify the signing algorithm.', h1: 'JWT Header Inspector' },
      { slug: 'json-web-token-decoder', title: 'JSON Web Token Decoder | Private Debugger', desc: 'Decode JSON Web Tokens completely offline for absolute privacy.', h1: 'JSON Web Token Decoder' },
      { slug: 'parse-jwt-online', title: 'Parse JWT Online | View Expiration Dates', desc: 'Parse your JWTs to check expiration and issued-at timestamps.', h1: 'Parse JWT Online' }
    ]
  },
  {
    baseTool: 'uuid-maker.html',
    variants: [
      { slug: 'guid-generator', title: 'GUID Generator | Create Unique Identifiers Online', desc: 'Generate cryptographically secure GUIDs instantly in your browser.', h1: 'GUID Generator' },
      { slug: 'uuid-v4-generator', title: 'UUID v4 Generator | Random UUID Generator', desc: 'Generate true random Version 4 UUIDs instantly and securely.', h1: 'UUID v4 Generator' },
      { slug: 'bulk-uuid-generator', title: 'Bulk UUID Generator | Generate 1000s of UUIDs', desc: 'Generate thousands of UUIDs at once and export to text files.', h1: 'Bulk UUID Generator' },
      { slug: 'online-uuid-creator', title: 'Online UUID Creator | RFC 4122 Compliant', desc: 'Create standard RFC 4122 compliant UUIDs instantly.', h1: 'Online UUID Creator' },
      { slug: 'uuid-v1-generator', title: 'UUID v1 Generator | Time-based Identifiers', desc: 'Generate Version 1 (time-based) UUIDs online.', h1: 'UUID v1 Generator' },
      { slug: 'generate-guid-online', title: 'Generate GUID Online | Unique ID Maker', desc: 'Fast, secure, offline GUID generation for developers.', h1: 'Generate GUID Online' }
    ]
  },
  {
    baseTool: 'markdown-previewer.html',
    variants: [
      { slug: 'online-markdown-editor', title: 'Online Markdown Editor | Live MD Preview', desc: 'Write and edit Markdown with a real-time live preview.', h1: 'Online Markdown Editor' },
      { slug: 'markdown-viewer', title: 'Markdown Viewer | Render MD Files Instantly', desc: 'View and render markdown text beautifully in your browser.', h1: 'Markdown Viewer' },
      { slug: 'md-to-html-converter', title: 'MD to HTML Converter | Convert Markdown', desc: 'Convert your Markdown files into clean HTML code instantly.', h1: 'MD to HTML Converter' },
      { slug: 'markdown-tester', title: 'Markdown Tester | Test MD Syntax Online', desc: 'Test your markdown syntax with a live, side-by-side preview.', h1: 'Markdown Tester' },
      { slug: 'github-flavored-markdown-editor', title: 'GitHub Flavored Markdown Editor | Live Preview', desc: 'Write in GitHub Flavored Markdown (GFM) with live rendering.', h1: 'GitHub Flavored Markdown' },
      { slug: 'markdown-playground', title: 'Markdown Playground | Free Online Editor', desc: 'A free online playground to learn, write, and export Markdown.', h1: 'Markdown Playground' }
    ]
  },
  {
    baseTool: 'qr-code-maker.html',
    variants: [
      { slug: 'free-qr-code-generator', title: 'Free QR Code Generator | Make Custom QR Codes', desc: 'Create permanent, non-expiring QR codes for URLs and text.', h1: 'Free QR Code Generator' },
      { slug: 'create-qr-code-online', title: 'Create QR Code Online | Fast & Secure', desc: 'Instantly create high-quality QR codes in your browser.', h1: 'Create QR Code Online' },
      { slug: 'wifi-qr-code-generator', title: 'WiFi QR Code Generator | Share Network', desc: 'Generate a QR code to let guests instantly connect to your WiFi.', h1: 'WiFi QR Code Generator' },
      { slug: 'vcard-qr-code-maker', title: 'vCard QR Code Maker | Digital Business Card', desc: 'Create a QR code for your contact information (vCard).', h1: 'vCard QR Code Maker' },
      { slug: 'svg-qr-code-generator', title: 'SVG QR Code Generator | High Res Vector QR', desc: 'Generate crisp, scalable vector SVG QR codes for printing.', h1: 'SVG QR Code Generator' },
      { slug: 'url-to-qr-code', title: 'URL to QR Code | Link to QR Converter', desc: 'Convert any website URL into a scannable QR code.', h1: 'URL to QR Code' }
    ]
  },
  {
    baseTool: 'css-minifier.html',
    variants: [
      { slug: 'minify-css-online', title: 'Minify CSS Online | Compress CSS Files Free', desc: 'Instantly minify your CSS code to reduce file size.', h1: 'Minify CSS Online' },
      { slug: 'compress-css', title: 'Compress CSS | Free CSS Optimizer Tool', desc: 'Compress CSS styles to remove whitespace and comments.', h1: 'Compress CSS' },
      { slug: 'css-formatter-online', title: 'CSS Formatter Online | Beautify CSS Code', desc: 'Un-minify and beautify compressed CSS files into readable code.', h1: 'CSS Formatter Online' },
      { slug: 'css-optimizer', title: 'CSS Optimizer | Reduce Stylesheet Size', desc: 'Optimize your stylesheets for faster web page load times.', h1: 'CSS Optimizer' },
      { slug: 'clean-css-code', title: 'Clean CSS Code | Free Online CSS Cleaner', desc: 'Clean up messy CSS and format it nicely.', h1: 'Clean CSS Code' },
      { slug: 'css-uglifier', title: 'CSS Uglifier | Obfuscate CSS Online', desc: 'Minify and uglify your CSS to save bandwidth.', h1: 'CSS Uglifier' }
    ]
  },
  {
    baseTool: 'html-minifier.html',
    variants: [
      { slug: 'minify-html-online', title: 'Minify HTML Online | Compress HTML Code', desc: 'Minify your HTML markup instantly to save bandwidth.', h1: 'Minify HTML Online' },
      { slug: 'compress-html', title: 'Compress HTML | Free HTML Optimizer', desc: 'Compress HTML files to boost page load speed and SEO.', h1: 'Compress HTML' },
      { slug: 'html-formatter', title: 'HTML Formatter | Beautify HTML Code', desc: 'Beautify and indent messy HTML code online.', h1: 'HTML Formatter' },
      { slug: 'clean-html-code', title: 'Clean HTML Code | Remove HTML Comments', desc: 'Strip comments and unnecessary whitespace from HTML files.', h1: 'Clean HTML Code' },
      { slug: 'html-optimizer', title: 'HTML Optimizer | Improve Web Vitals', desc: 'Optimize HTML size to improve Core Web Vitals.', h1: 'HTML Optimizer' },
      { slug: 'html-uglifier', title: 'HTML Uglifier | Minify Source Code', desc: 'Uglify and minify HTML source code securely.', h1: 'HTML Uglifier' }
    ]
  },
  {
    baseTool: 'lorem-ipsum-generator.html',
    variants: [
      { slug: 'dummy-text-generator', title: 'Dummy Text Generator | Free Placeholder Text', desc: 'Generate random placeholder dummy text for UI mockups.', h1: 'Dummy Text Generator' },
      { slug: 'random-text-generator', title: 'Random Text Generator | Copy & Paste Lorem Ipsum', desc: 'Create paragraphs, words, and lists of random text.', h1: 'Random Text Generator' },
      { slug: 'lorem-ipsum-paragraphs', title: 'Lorem Ipsum Paragraphs | Dummy Text Maker', desc: 'Generate 1 to 100 paragraphs of standard Lorem Ipsum.', h1: 'Lorem Ipsum Paragraphs' },
      { slug: 'placeholder-text-creator', title: 'Placeholder Text Creator | Web Design Filler', desc: 'Create filler text for wireframes, templates, and designs.', h1: 'Placeholder Text Creator' },
      { slug: 'gibberish-generator', title: 'Gibberish Generator | Meaningless Text', desc: 'Generate random gibberish text for design layouts.', h1: 'Gibberish Generator' },
      { slug: 'mockup-text-generator', title: 'Mockup Text Generator | UI Text Filler', desc: 'Generate mockup text for Figma, Sketch, and Adobe XD designs.', h1: 'Mockup Text Generator' }
    ]
  },
  {
    baseTool: 'quote-generator.html',
    variants: [
      { slug: 'random-quote-generator', title: 'Random Quote Generator | Daily Inspiration', desc: 'Generate random inspirational and motivational quotes instantly.', h1: 'Random Quote Generator' },
      { slug: 'inspirational-quote-maker', title: 'Inspirational Quote Maker | Get Inspired', desc: 'Discover new inspirational quotes for your day.', h1: 'Inspirational Quote Maker' },
      { slug: 'motivational-quotes-online', title: 'Motivational Quotes Online | Free Generator', desc: 'Generate random motivational quotes to stay driven.', h1: 'Motivational Quotes Online' },
      { slug: 'quote-of-the-day-generator', title: 'Quote of the Day Generator | Daily Wisdom', desc: 'Find your quote of the day with one click.', h1: 'Quote of the Day Generator' },
      { slug: 'famous-quotes-generator', title: 'Famous Quotes Generator | Historical Quotes', desc: 'Generate random quotes from famous historical figures.', h1: 'Famous Quotes Generator' },
      { slug: 'random-phrase-generator', title: 'Random Phrase Generator | Meaningful Sayings', desc: 'Generate random meaningful phrases and proverbs.', h1: 'Random Phrase Generator' }
    ]
  },
  {
    baseTool: 'typing-speed-test.html',
    variants: [
      { slug: 'wpm-test-online', title: 'WPM Test Online | Words Per Minute Typing Test', desc: 'Test your typing speed and accuracy online for free.', h1: 'WPM Test Online' },
      { slug: 'typing-test-1-minute', title: '1 Minute Typing Test | Free Speed Test', desc: 'Take a quick 1-minute typing test to benchmark your speed.', h1: '1 Minute Typing Test' },
      { slug: 'keyboard-speed-test', title: 'Keyboard Speed Test | Measure Your WPM', desc: 'Measure how fast you can type on your keyboard.', h1: 'Keyboard Speed Test' },
      { slug: 'typing-accuracy-test', title: 'Typing Accuracy Test | Find Your Error Rate', desc: 'Test your typing accuracy and reduce your typo rate.', h1: 'Typing Accuracy Test' },
      { slug: 'fast-typing-practice', title: 'Fast Typing Practice | Improve WPM', desc: 'Practice typing fast to improve your words per minute.', h1: 'Fast Typing Practice' },
      { slug: 'touch-typing-test', title: 'Touch Typing Test | Blind Typing Benchmark', desc: 'Benchmark your touch typing skills online.', h1: 'Touch Typing Test' }
    ]
  },
  {
    baseTool: 'ascii-art-generator.html',
    variants: [
      { slug: 'text-to-ascii-art', title: 'Text to ASCII Art | ASCII Banner Generator', desc: 'Convert text into cool ASCII art banners with custom fonts.', h1: 'Text to ASCII Art' },
      { slug: 'ascii-text-generator', title: 'ASCII Text Generator | Cool Text Art', desc: 'Generate cool ASCII text art for Discord or README files.', h1: 'ASCII Text Generator' },
      { slug: 'figlet-text-generator', title: 'FIGlet Text Generator | Large ASCII Letters', desc: 'Create FIGlet text online using various ASCII fonts.', h1: 'FIGlet Text Generator' },
      { slug: 'ascii-banner-maker', title: 'ASCII Banner Maker | Free Terminal Banners', desc: 'Make terminal-style ASCII banners from regular text.', h1: 'ASCII Banner Maker' },
      { slug: 'discord-ascii-text', title: 'Discord ASCII Text | Cool Copy Paste Art', desc: 'Generate ASCII text art to copy and paste into Discord.', h1: 'Discord ASCII Text' },
      { slug: 'retro-text-generator', title: 'Retro Text Generator | 80s ASCII Style', desc: 'Generate retro-style 80s ASCII text art online.', h1: 'Retro Text Generator' }
    ]
  },
  {
    baseTool: 'case-converter.html',
    variants: [
      { slug: 'uppercase-converter', title: 'Uppercase Converter | Change Text to All Caps', desc: 'Convert text to uppercase, lowercase, or title case instantly.', h1: 'Uppercase Converter' },
      { slug: 'title-case-converter', title: 'Title Case Converter | Capitalize First Letters', desc: 'Easily convert your titles and headlines into proper Title Case.', h1: 'Title Case Converter' },
      { slug: 'lowercase-converter', title: 'Lowercase Converter | Text to Small Letters', desc: 'Convert all caps text down to standard lowercase.', h1: 'Lowercase Converter' },
      { slug: 'sentence-case-converter', title: 'Sentence Case Converter | Capitalize Sentences', desc: 'Format messy text into proper sentence case automatically.', h1: 'Sentence Case Converter' },
      { slug: 'camelcase-generator', title: 'CamelCase Generator | Convert Strings for Code', desc: 'Convert normal text into camelCase strings for programming.', h1: 'CamelCase Generator' },
      { slug: 'snake-case-converter', title: 'Snake Case Converter | Text to snake_case', desc: 'Convert sentences into snake_case formatted strings.', h1: 'Snake Case Converter' }
    ]
  },
  {
    baseTool: 'gradient-generator.html',
    variants: [
      { slug: 'css-gradient-maker', title: 'CSS Gradient Maker | Free Gradient Generator', desc: 'Create beautiful CSS gradients online and copy the code.', h1: 'CSS Gradient Maker' },
      { slug: 'linear-gradient-generator', title: 'Linear Gradient Generator | CSS Backgrounds', desc: 'Generate linear CSS gradients with custom angles and colors.', h1: 'Linear Gradient Generator' },
      { slug: 'radial-gradient-maker', title: 'Radial Gradient Maker | Circular CSS Gradients', desc: 'Create stunning radial CSS backgrounds easily.', h1: 'Radial Gradient Maker' },
      { slug: 'ui-gradient-picker', title: 'UI Gradient Picker | Beautiful Color Blends', desc: 'Pick and customize beautiful color blends for UI design.', h1: 'UI Gradient Picker' },
      { slug: 'css-background-generator', title: 'CSS Background Generator | Code Export', desc: 'Generate background CSS code instantly.', h1: 'CSS Background Generator' },
      { slug: 'tailwind-gradient-generator', title: 'Tailwind Gradient Generator | Tailwind CSS', desc: 'Generate gradients tailored for modern web frameworks.', h1: 'Tailwind Gradient Generator' }
    ]
  },
  {
    baseTool: 'contrast-checker.html',
    variants: [
      { slug: 'color-contrast-checker', title: 'Color Contrast Checker | WCAG Compliance Tool', desc: 'Check color contrast ratios online to ensure accessibility.', h1: 'Color Contrast Checker' },
      { slug: 'wcag-contrast-ratio', title: 'WCAG Contrast Ratio Calculator | AA & AAA', desc: 'Calculate if your foreground and background colors pass WCAG AA/AAA.', h1: 'WCAG Contrast Ratio' },
      { slug: 'accessibility-color-checker', title: 'Accessibility Color Checker | A11y Colors', desc: 'Ensure your web colors are accessible to visually impaired users.', h1: 'Accessibility Color Checker' },
      { slug: 'text-contrast-calculator', title: 'Text Contrast Calculator | Readability Check', desc: 'Calculate if text is readable against its background color.', h1: 'Text Contrast Calculator' },
      { slug: 'ui-contrast-tester', title: 'UI Contrast Tester | Design Accessibility', desc: 'Test your UI designs for proper accessibility contrast.', h1: 'UI Contrast Tester' },
      { slug: 'hex-contrast-checker', title: 'HEX Contrast Checker | Compare Color Codes', desc: 'Compare two HEX codes to see their contrast ratio.', h1: 'HEX Contrast Checker' }
    ]
  },
  {
    baseTool: 'hash-generator.html',
    variants: [
      { slug: 'sha256-hash-generator', title: 'SHA256 Hash Generator | Secure Hash Calculator', desc: 'Generate secure SHA-256 hashes from text instantly.', h1: 'SHA256 Hash Generator' },
      { slug: 'md5-hash-generator', title: 'MD5 Hash Generator | Free MD5 Calculator', desc: 'Calculate MD5 hashes of any text string online.', h1: 'MD5 Hash Generator' },
      { slug: 'sha512-generator', title: 'SHA512 Hash Generator | Cryptographic Hash', desc: 'Generate SHA-512 hashes online securely.', h1: 'SHA512 Hash Generator' },
      { slug: 'sha1-calculator', title: 'SHA1 Calculator | String to SHA1 Hash', desc: 'Convert text strings to SHA-1 hashes instantly.', h1: 'SHA1 Calculator' },
      { slug: 'hmac-generator', title: 'HMAC Generator | Hash Message Authentication', desc: 'Generate HMACs using a secret key online.', h1: 'HMAC Generator' },
      { slug: 'string-hasher-online', title: 'String Hasher Online | Multi-Algorithm Hashes', desc: 'Hash strings using multiple algorithms simultaneously.', h1: 'String Hasher Online' }
    ]
  },
  {
    baseTool: 'base64-encoder.html',
    variants: [
      { slug: 'base64-encode-online', title: 'Base64 Encode Online | String to Base64', desc: 'Encode text strings into Base64 format instantly and securely.', h1: 'Base64 Encode Online' },
      { slug: 'base64-decode-online', title: 'Base64 Decode Online | Base64 to String', desc: 'Decode Base64 strings back to readable text offline.', h1: 'Base64 Decode Online' },
      { slug: 'text-to-base64', title: 'Text to Base64 Converter | Encode Data', desc: 'Convert plain text into Base64 encoded data.', h1: 'Text to Base64 Converter' },
      { slug: 'base64-to-text', title: 'Base64 to Text Converter | Decode Data', desc: 'Convert Base64 encoded data back to plain text.', h1: 'Base64 to Text Converter' },
      { slug: 'utf8-to-base64', title: 'UTF8 to Base64 | Encode Special Characters', desc: 'Properly encode UTF-8 text to Base64 online.', h1: 'UTF8 to Base64' },
      { slug: 'base64-string-generator', title: 'Base64 String Generator | Free Dev Tool', desc: 'Generate Base64 strings for authentication headers.', h1: 'Base64 String Generator' }
    ]
  },
  {
    baseTool: 'number-converter.html',
    variants: [
      { slug: 'hex-to-decimal-converter', title: 'Hex to Decimal Converter | Hexadecimal Calculator', desc: 'Convert hexadecimal numbers to decimal, binary, and octal.', h1: 'Hex to Decimal Converter' },
      { slug: 'binary-to-decimal', title: 'Binary to Decimal Converter | Base 2 to Base 10', desc: 'Easily convert binary strings into decimal numbers.', h1: 'Binary to Decimal' },
      { slug: 'decimal-to-binary', title: 'Decimal to Binary Converter | Math Tools', desc: 'Convert standard decimal numbers into binary code.', h1: 'Decimal to Binary' },
      { slug: 'binary-to-hex', title: 'Binary to Hex Converter | Fast Conversion', desc: 'Convert binary code directly into hexadecimal format.', h1: 'Binary to Hex' },
      { slug: 'octal-converter-online', title: 'Octal Converter Online | Base 8 Calculations', desc: 'Convert numbers to and from Octal (Base 8).', h1: 'Octal Converter Online' },
      { slug: 'base-converter-tool', title: 'Base Converter Tool | Radix Conversion', desc: 'Convert numbers across any radix (Base 2 through 36).', h1: 'Base Converter Tool' }
    ]
  },
  {
    baseTool: 'image-compressor.html',
    variants: [
      { slug: 'compress-jpeg-online', title: 'Compress JPEG Online | Reduce Image File Size', desc: 'Shrink JPEG images without losing quality in your browser.', h1: 'Compress JPEG Online' },
      { slug: 'png-compressor', title: 'PNG Compressor | Reduce PNG Size', desc: 'Compress transparent PNG files efficiently online.', h1: 'PNG Compressor' },
      { slug: 'webp-compressor', title: 'WebP Compressor | Optimize Next-Gen Images', desc: 'Compress WebP images for faster web performance.', h1: 'WebP Compressor' },
      { slug: 'image-size-reducer', title: 'Image Size Reducer | Shrink Photos to KB', desc: 'Reduce the file size of photos to a few kilobytes.', h1: 'Image Size Reducer' },
      { slug: 'bulk-image-compressor', title: 'Bulk Image Compressor | Compress Multiple Files', desc: 'Compress multiple images at once securely offline.', h1: 'Bulk Image Compressor' },
      { slug: 'lossless-image-compressor', title: 'Lossless Image Compressor | Retain Quality', desc: 'Compress images losslessly to retain perfect visual quality.', h1: 'Lossless Image Compressor' }
    ]
  },
  {
    baseTool: 'regex-tester.html',
    variants: [
      { slug: 'regex-tester-online', title: 'Regex Tester Online | Regular Expression Matcher', desc: 'Test, match, and debug regular expressions online.', h1: 'Regex Tester Online' },
      { slug: 'regular-expression-checker', title: 'Regular Expression Checker | Find Matches', desc: 'Check if your regular expression matches a string of text.', h1: 'Regular Expression Checker' },
      { slug: 'javascript-regex-tester', title: 'JavaScript Regex Tester | Live Regex Debugger', desc: 'Test JavaScript flavor regex patterns live in your browser.', h1: 'JavaScript Regex Tester' },
      { slug: 'regex-match-extractor', title: 'Regex Match Extractor | Extract Data', desc: 'Extract data from text using regular expressions.', h1: 'Regex Match Extractor' },
      { slug: 'pcre-tester', title: 'PCRE Tester | Test Perl Compatible Regex', desc: 'Test standard PCRE regex patterns online.', h1: 'PCRE Tester' },
      { slug: 'regex-cheat-sheet-tool', title: 'Regex Cheat Sheet Tool | Learn Regular Expressions', desc: 'Learn and test regular expressions interactively.', h1: 'Regex Cheat Sheet Tool' }
    ]
  },
  {
    baseTool: 'url-encoder.html',
    variants: [
      { slug: 'url-encode-online', title: 'URL Encode Online | URI Component Encoding', desc: 'Safely encode URL components for use in web links.', h1: 'URL Encode Online' },
      { slug: 'url-decode-online', title: 'URL Decode Online | URI Component Decoding', desc: 'Decode URL-encoded strings back to readable text.', h1: 'URL Decode Online' },
      { slug: 'encodeuricomponent-tool', title: 'encodeURIComponent Tool | JS URL Encoder', desc: 'Encode strings exactly like JavaScript encodeURIComponent.', h1: 'encodeURIComponent Tool' },
      { slug: 'decodeuricomponent-tool', title: 'decodeURIComponent Tool | JS URL Decoder', desc: 'Decode strings exactly like JavaScript decodeURIComponent.', h1: 'decodeURIComponent Tool' },
      { slug: 'percent-encoding-tool', title: 'Percent Encoding Tool | Convert Special Chars', desc: 'Convert special characters to percent-encoded formats.', h1: 'Percent Encoding Tool' },
      { slug: 'query-string-encoder', title: 'Query String Encoder | URL Params Tool', desc: 'Encode URL parameters and query strings safely.', h1: 'Query String Encoder' }
    ]
  },
  {
    baseTool: 'color-picker.html',
    variants: [
      { slug: 'hex-color-picker', title: 'Hex Color Picker | Find HTML Color Codes', desc: 'Pick colors and instantly get their HEX, RGB, and HSL values.', h1: 'Hex Color Picker' },
      { slug: 'rgb-color-picker', title: 'RGB Color Picker | Online RGB Values', desc: 'Find perfect RGB values for your CSS and designs.', h1: 'RGB Color Picker' },
      { slug: 'hsl-color-picker', title: 'HSL Color Picker | Hue Saturation Lightness', desc: 'Pick colors using the HSL color space online.', h1: 'HSL Color Picker' },
      { slug: 'color-code-finder', title: 'Color Code Finder | Get CSS Colors', desc: 'Find the perfect CSS color code for your website.', h1: 'Color Code Finder' },
      { slug: 'html-color-codes', title: 'HTML Color Codes | Web Safe Colors', desc: 'Browse and select web-safe HTML color codes.', h1: 'HTML Color Codes' },
      { slug: 'color-palette-picker', title: 'Color Palette Picker | UI Design Tool', desc: 'Pick colors to build beautiful UI palettes.', h1: 'Color Palette Picker' }
    ]
  },
  {
    baseTool: 'unit-converter.html',
    variants: [
      { slug: 'length-converter', title: 'Length Converter | Convert Meters to Feet', desc: 'Convert between meters, feet, inches, and miles.', h1: 'Length Converter' },
      { slug: 'weight-converter', title: 'Weight Converter | Kilograms to Pounds', desc: 'Easily convert between kg, lbs, grams, and ounces.', h1: 'Weight Converter' },
      { slug: 'temperature-converter', title: 'Temperature Converter | Celsius to Fahrenheit', desc: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin.', h1: 'Temperature Converter' },
      { slug: 'volume-converter', title: 'Volume Converter | Liters to Gallons', desc: 'Convert liquid volume units instantly online.', h1: 'Volume Converter' },
      { slug: 'metric-conversion-calculator', title: 'Metric Conversion Calculator | Imperial to Metric', desc: 'Convert between Imperial and Metric systems easily.', h1: 'Metric Conversion Calculator' },
      { slug: 'speed-converter', title: 'Speed Converter | MPH to KMH', desc: 'Convert speeds between miles per hour and kilometers per hour.', h1: 'Speed Converter' }
    ]
  },
  {
    baseTool: 'timezone-converter.html',
    variants: [
      { slug: 'time-zone-converter', title: 'Time Zone Converter | Compare Global Times', desc: 'Convert and compare times across global time zones.', h1: 'Time Zone Converter' },
      { slug: 'est-to-pst-converter', title: 'EST to PST Converter | US Time Zones', desc: 'Instantly convert Eastern Time to Pacific Time.', h1: 'EST to PST Converter' },
      { slug: 'utc-time-converter', title: 'UTC Time Converter | Coordinate Universal Time', desc: 'Convert any local time to UTC instantly.', h1: 'UTC Time Converter' },
      { slug: 'gmt-time-converter', title: 'GMT Time Converter | Greenwich Mean Time', desc: 'Convert time zones to and from GMT.', h1: 'GMT Time Converter' },
      { slug: 'meeting-planner-time', title: 'Meeting Planner Time Zone Converter | Global Teams', desc: 'Find the perfect meeting time for global remote teams.', h1: 'Meeting Planner Time Zones' },
      { slug: 'local-time-converter', title: 'Local Time Converter | What Time Is It In...', desc: 'Check the current local time anywhere in the world.', h1: 'Local Time Converter' }
    ]
  },
  {
    baseTool: 'pomodoro-timer.html',
    variants: [
      { slug: 'pomodoro-timer-online', title: 'Pomodoro Timer Online | Focus and Work Timer', desc: 'A simple Pomodoro timer to boost productivity.', h1: 'Pomodoro Timer Online' },
      { slug: 'tomato-timer', title: 'Tomato Timer | Free Pomodoro Technique Tool', desc: 'Use the famous Tomato Timer technique to manage work.', h1: 'Tomato Timer' },
      { slug: 'study-timer-online', title: 'Study Timer Online | 25 Minute Focus Timer', desc: 'A 25-minute focus timer perfect for studying.', h1: 'Study Timer Online' },
      { slug: 'adhd-focus-timer', title: 'ADHD Focus Timer | Stay on Task', desc: 'A distraction-free timer to help individuals with ADHD focus.', h1: 'ADHD Focus Timer' },
      { slug: 'productivity-timer', title: 'Productivity Timer | Work & Break Cycles', desc: 'Manage your work and break cycles effectively.', h1: 'Productivity Timer' },
      { slug: 'pomodoro-clock', title: 'Pomodoro Clock | Minimalist Work Timer', desc: 'A minimalist web-based Pomodoro clock for developers.', h1: 'Pomodoro Clock' }
    ]
  },
  {
    baseTool: 'stopwatch-timer.html',
    variants: [
      { slug: 'online-stopwatch', title: 'Online Stopwatch | Free Browser Stopwatch', desc: 'A simple, accurate online stopwatch with lap tracking.', h1: 'Online Stopwatch' },
      { slug: 'countdown-timer-online', title: 'Countdown Timer Online | Set Alarms & Timers', desc: 'Set a free countdown timer for any duration.', h1: 'Countdown Timer Online' },
      { slug: 'digital-stopwatch', title: 'Digital Stopwatch | Millisecond Accuracy', desc: 'A precise digital stopwatch with millisecond accuracy.', h1: 'Digital Stopwatch' },
      { slug: 'lap-timer-online', title: 'Lap Timer Online | Track Split Times', desc: 'Track laps and split times directly in your browser.', h1: 'Lap Timer Online' },
      { slug: 'fullscreen-stopwatch', title: 'Fullscreen Stopwatch | Large Display Timer', desc: 'A large, full-screen stopwatch ideal for presentations.', h1: 'Fullscreen Stopwatch' },
      { slug: 'simple-timer-online', title: 'Simple Timer Online | Easy Web Timer', desc: 'A ridiculously simple online timer. No ads, just time.', h1: 'Simple Timer Online' }
    ]
  },
  {
    baseTool: 'text-diff-checker.html',
    variants: [
      { slug: 'compare-text-online', title: 'Compare Text Online | Text Difference Checker', desc: 'Compare two text blocks to find differences.', h1: 'Compare Text Online' },
      { slug: 'difference-checker', title: 'Difference Checker | Find Text Differences', desc: 'A fast browser-based difference checker to compare files.', h1: 'Difference Checker' },
      { slug: 'code-diff-tool', title: 'Code Diff Tool | Compare Source Code', desc: 'Compare source code side-by-side to find modifications.', h1: 'Code Diff Tool' },
      { slug: 'file-compare-online', title: 'File Compare Online | Check String Changes', desc: 'Compare text strings to see what was added or removed.', h1: 'File Compare Online' },
      { slug: 'diff-viewer', title: 'Diff Viewer | Online Version Comparison', desc: 'View differences between two versions of a document.', h1: 'Diff Viewer' },
      { slug: 'plagiarism-diff-checker', title: 'Plagiarism Diff Checker | Compare Essays', desc: 'Compare two essays to highlight identical text blocks.', h1: 'Plagiarism Diff Checker' }
    ]
  },
  {
    baseTool: 'reaction-time-test.html',
    variants: [
      { slug: 'reaction-time-tester', title: 'Reaction Time Tester | Benchmark Your Reflexes', desc: 'Test your reflexes and reaction time with this benchmark.', h1: 'Reaction Time Tester' },
      { slug: 'human-benchmark-test', title: 'Human Benchmark Test | Check Reaction Speed', desc: 'Measure your cognitive and physical reaction speed.', h1: 'Human Benchmark Test' },
      { slug: 'click-speed-test', title: 'Click Speed Test | Mouse Reaction Time', desc: 'Test how fast you can click when the screen turns green.', h1: 'Click Speed Test' },
      { slug: 'reflex-test-online', title: 'Reflex Test Online | Fast Gamer Test', desc: 'Gamers: Test your reflexes to see if you have fast twitch muscle response.', h1: 'Reflex Test Online' },
      { slug: 'average-reaction-time', title: 'Average Reaction Time Test | Compare Scores', desc: 'Find out if your reaction time is faster than average.', h1: 'Average Reaction Time Test' },
      { slug: 'aim-reaction-test', title: 'Aim Reaction Test | FPS Gamer Benchmark', desc: 'Benchmark your raw reaction speed for FPS gaming.', h1: 'Aim Reaction Test' }
    ]
  },
  {
    baseTool: 'csv-to-json.html',
    variants: [
      { slug: 'convert-csv-to-json', title: 'Convert CSV to JSON | Free Online Converter', desc: 'Easily convert CSV files into JSON format right in your browser.', h1: 'Convert CSV to JSON' },
      { slug: 'csv-to-json-converter', title: 'CSV to JSON Converter | Parse CSV Data', desc: 'Parse CSV data and convert it to structured JSON arrays.', h1: 'CSV to JSON Converter' },
      { slug: 'excel-to-json-online', title: 'Excel to JSON Online | Export Data', desc: 'Paste Excel spreadsheet data to instantly get JSON output.', h1: 'Excel to JSON Online' },
      { slug: 'csv-to-json-array', title: 'CSV to JSON Array | Web Developer Tool', desc: 'Convert flat CSV files into an array of JSON objects.', h1: 'CSV to JSON Array' },
      { slug: 'bulk-csv-to-json', title: 'Bulk CSV to JSON | Fast Offline Parsing', desc: 'Convert massive CSV files to JSON completely offline.', h1: 'Bulk CSV to JSON' },
      { slug: 'csv-parser-online', title: 'CSV Parser Online | Format CSV Data', desc: 'Parse messy CSV strings into clean JSON formatting.', h1: 'CSV Parser Online' }
    ]
  },
  {
    baseTool: 'json-to-csv.html',
    variants: [
      { slug: 'convert-json-to-csv', title: 'Convert JSON to CSV | Free Online Converter', desc: 'Flatten nested JSON into a clean CSV file instantly.', h1: 'Convert JSON to CSV' },
      { slug: 'json-to-csv-converter', title: 'JSON to CSV Converter | Export JSON Data', desc: 'Export JSON data into Excel-compatible CSV formats.', h1: 'JSON to CSV Converter' },
      { slug: 'json-to-excel-online', title: 'JSON to Excel Online | Free Formatter', desc: 'Convert JSON arrays into tabular data for Microsoft Excel.', h1: 'JSON to Excel Online' },
      { slug: 'flatten-json-online', title: 'Flatten JSON Online | Nested JSON to Table', desc: 'Flatten deeply nested JSON objects into a flat table.', h1: 'Flatten JSON Online' },
      { slug: 'json-array-to-csv', title: 'JSON Array to CSV | Convert Object Arrays', desc: 'Convert arrays of JSON objects into comma-separated values.', h1: 'JSON Array to CSV' },
      { slug: 'json-to-spreadsheet', title: 'JSON to Spreadsheet | Fast Export Tool', desc: 'Generate spreadsheet-ready data from raw JSON APIs.', h1: 'JSON to Spreadsheet' }
    ]
  },
  {
    baseTool: 'csv-inspector.html',
    variants: [
      { slug: 'csv-viewer-online', title: 'CSV Viewer Online | Read & Inspect CSV Files', desc: 'View, validate, and inspect large CSV files directly in your browser.', h1: 'CSV Viewer Online' },
      { slug: 'csv-validator', title: 'CSV Validator | Check CSV Syntax Errors', desc: 'Validate CSV files for missing columns and syntax errors.', h1: 'CSV Validator' },
      { slug: 'online-csv-reader', title: 'Online CSV Reader | Open Large CSV Files', desc: 'Open and read large CSV files without installing Excel.', h1: 'Online CSV Reader' },
      { slug: 'csv-table-viewer', title: 'CSV Table Viewer | View CSV as HTML Table', desc: 'Instantly view raw CSV data formatted as a beautiful HTML table.', h1: 'CSV Table Viewer' },
      { slug: 'csv-editor-online', title: 'CSV Editor Online | Edit Comma Separated Values', desc: 'A simple way to view and inspect comma separated values.', h1: 'CSV Editor Online' },
      { slug: 'csv-linter', title: 'CSV Linter | Find Data Inconsistencies', desc: 'Lint your CSV files to find formatting inconsistencies.', h1: 'CSV Linter' }
    ]
  },
  {
    baseTool: 'slug-generator.html',
    variants: [
      { slug: 'url-slug-generator', title: 'URL Slug Generator | Text to Slug Converter', desc: 'Convert any text into a clean, SEO-friendly URL slug.', h1: 'URL Slug Generator' },
      { slug: 'text-to-slug', title: 'Text to Slug | Create Clean Permalinks', desc: 'Turn article titles into clean, hypen-separated permalinks.', h1: 'Text to Slug' },
      { slug: 'seo-slug-maker', title: 'SEO Slug Maker | Optimize URLs for Google', desc: 'Make your URLs SEO friendly by generating perfect slugs.', h1: 'SEO Slug Maker' },
      { slug: 'slugify-string-online', title: 'Slugify String Online | String to URL', desc: 'Slugify strings online with standard URL encoding rules.', h1: 'Slugify String Online' },
      { slug: 'permalink-generator', title: 'Permalink Generator | WordPress Style Slugs', desc: 'Generate WordPress-style permalinks from raw text.', h1: 'Permalink Generator' },
      { slug: 'clean-url-generator', title: 'Clean URL Generator | Remove Special Characters', desc: 'Strip special characters from strings to create clean URLs.', h1: 'Clean URL Generator' }
    ]
  },
  {
    baseTool: 'meta-tag-generator.html',
    variants: [
      { slug: 'seo-meta-tag-generator', title: 'SEO Meta Tag Generator | Generate HTML Tags', desc: 'Create perfect SEO meta tags for your website.', h1: 'SEO Meta Tag Generator' },
      { slug: 'html-meta-tags', title: 'HTML Meta Tags Generator | Copy & Paste', desc: 'Generate standard HTML `<meta>` tags instantly.', h1: 'HTML Meta Tags' },
      { slug: 'open-graph-generator', title: 'Open Graph Generator | OG Tags for Facebook', desc: 'Generate Open Graph (OG) tags for Facebook and LinkedIn sharing.', h1: 'Open Graph Generator' },
      { slug: 'twitter-card-generator', title: 'Twitter Card Generator | Meta Tags for Twitter', desc: 'Create Twitter Card meta tags to show images on tweets.', h1: 'Twitter Card Generator' },
      { slug: 'meta-description-maker', title: 'Meta Description Maker | HTML Head Builder', desc: 'Build out the `<head>` section of your website visually.', h1: 'Meta Description Maker' },
      { slug: 'website-meta-tags', title: 'Website Meta Tags Tool | Free SEO Utility', desc: 'Generate all necessary website meta tags in one click.', h1: 'Website Meta Tags Tool' }
    ]
  },
  {
    baseTool: 'robots-txt-generator.html',
    variants: [
      { slug: 'robots-txt-maker', title: 'Robots.txt Maker | Generate Robots.txt Files', desc: 'Easily create custom robots.txt files for your website.', h1: 'Robots.txt Maker' },
      { slug: 'generate-robots-txt', title: 'Generate Robots.txt | SEO Crawl Control', desc: 'Control search engine crawlers with a valid robots.txt file.', h1: 'Generate Robots.txt' },
      { slug: 'robots-txt-creator', title: 'Robots.txt Creator | Allow or Disallow Bots', desc: 'Allow or disallow Googlebot from crawling specific paths.', h1: 'Robots.txt Creator' },
      { slug: 'seo-robots-generator', title: 'SEO Robots Generator | Free Webmaster Tool', desc: 'A free webmaster tool to generate standard robots.txt files.', h1: 'SEO Robots Generator' },
      { slug: 'googlebot-txt-maker', title: 'Googlebot TXT Maker | Search Index Rules', desc: 'Define search index rules for Googlebot and Bingbot.', h1: 'Googlebot TXT Maker' },
      { slug: 'robots-txt-builder', title: 'Robots.txt Builder | Custom User Agents', desc: 'Build a robots.txt file with custom User-Agent directives.', h1: 'Robots.txt Builder' }
    ]
  },
  {
    baseTool: 'sitemap-generator.html',
    variants: [
      { slug: 'xml-sitemap-generator', title: 'XML Sitemap Generator | Build Visual Sitemaps', desc: 'Generate basic XML sitemaps with custom priorities.', h1: 'XML Sitemap Generator' },
      { slug: 'create-sitemap-online', title: 'Create Sitemap Online | Free SEO Tool', desc: 'Create an XML sitemap online for Google Search Console.', h1: 'Create Sitemap Online' },
      { slug: 'html-sitemap-maker', title: 'HTML Sitemap Maker | Generate Site Links', desc: 'Generate an HTML list of links for your website footer.', h1: 'HTML Sitemap Maker' },
      { slug: 'visual-sitemap-builder', title: 'Visual Sitemap Builder | Organize URLs', desc: 'Organize your URLs into a proper sitemap structure.', h1: 'Visual Sitemap Builder' },
      { slug: 'google-sitemap-generator', title: 'Google Sitemap Generator | Index Faster', desc: 'Generate sitemaps formatted perfectly for Google indexing.', h1: 'Google Sitemap Generator' },
      { slug: 'sitemap-xml-creator', title: 'Sitemap.xml Creator | Configure Priority', desc: 'Configure changefreq and priority for your sitemap.xml.', h1: 'Sitemap.xml Creator' }
    ]
  }
];

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const INDEX_PSEO_VARIANTS = process.env.INDEX_PSEO_VARIANTS === 'true';

let generatedCount = 0;
const newUrls = [];

config.forEach(mapping => {
  const basePath = path.join(TOOLS_DIR, mapping.baseTool);
  if (!fs.existsSync(basePath)) {
    console.error(`Base tool not found: ${basePath}`);
    return;
  }

  const baseHtml = fs.readFileSync(basePath, 'utf8');

  mapping.variants.forEach(variant => {
    const variantPath = path.join(TOOLS_DIR, `${variant.slug}.html`);
    const variantUrl = `https://toolsmatic.me/tools/${variant.slug}.html`;
    const baseUrl = `https://toolsmatic.me/tools/${mapping.baseTool}`;
    const canonicalUrl = INDEX_PSEO_VARIANTS ? variantUrl : baseUrl;

    let newHtml = baseHtml;

    // Replace Title
    newHtml = newHtml.replace(/<title>.*?<\/title>/s, `<title>${variant.title} - ToolsMatic</title>`);
    
    // Replace Meta Description
    newHtml = newHtml.replace(/<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${variant.desc}" />`);
    
    // Replace H1 (assumes single main H1)
    newHtml = newHtml.replace(/<h1>.*?<\/h1>/s, `<h1>${variant.h1}</h1>`);
    
    // Replace Canonical Link
    newHtml = newHtml.replace(/<link rel="canonical" href=".*?"\s*\/>/s, `<link rel="canonical" href="${canonicalUrl}" />`);
    if (!INDEX_PSEO_VARIANTS) {
      newHtml = newHtml.replace(/<meta\s+name="robots"\s+content=".*?"\s*\/>/s, '');
      newHtml = newHtml.replace('</head>', '  <meta name="robots" content="noindex,follow">\n</head>');
    }
    
    // Replace OG Title and URL
    newHtml = newHtml.replace(/<meta property="og:title" content=".*?"\s*\/>/s, `<meta property="og:title" content="${variant.title}" />`);
    newHtml = newHtml.replace(/<meta property="og:url" content=".*?"\s*\/>/s, `<meta property="og:url" content="${variantUrl}" />`);
    newHtml = newHtml.replace(/<meta property="og:description" content=".*?"\s*\/>/s, `<meta property="og:description" content="${variant.desc}" />`);
    
    // Replace Twitter tags
    newHtml = newHtml.replace(/<meta name="twitter:title" content=".*?"\s*\/>/s, `<meta name="twitter:title" content="${variant.title}" />`);
    newHtml = newHtml.replace(/<meta name="twitter:description" content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${variant.desc}" />`);
    newHtml = newHtml.replace(/<meta name="twitter:url" content=".*?"\s*\/>/s, `<meta name="twitter:url" content="${variantUrl}" />`);

    fs.writeFileSync(variantPath, newHtml, 'utf8');
    console.log(`Generated: ${variant.slug}.html`);
    generatedCount++;
    newUrls.push(variantUrl);
  });
});

console.log(`\nSuccessfully generated ${generatedCount} SEO variant pages.`);

// Update sitemap.xml
if (INDEX_PSEO_VARIANTS && fs.existsSync(SITEMAP_PATH) && newUrls.length > 0) {
  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  
  // Find where to insert (before </urlset>)
  const insertIndex = sitemap.lastIndexOf('</urlset>');
  if (insertIndex !== -1) {
    let injection = `\n  <!-- Generated SEO Variants -->\n`;
    newUrls.forEach(url => {
      // Check if already in sitemap
      if (!sitemap.includes(`<loc>${url}</loc>`)) {
        injection += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }
    });

    sitemap = sitemap.slice(0, insertIndex) + injection + sitemap.slice(insertIndex);
    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log(`Injected new URLs into sitemap.xml`);
  }
}

if (!INDEX_PSEO_VARIANTS) {
  console.log('SEO variants are canonicalized to their core tools and are not added to the sitemap.');
}
