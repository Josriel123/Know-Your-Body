import fs from 'fs';
import path from 'path';

const publicPath = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicPath).filter(f => f.endsWith('.html') && f !== 'services.html' && f !== 'contact-us.html');

for(const file of files) {
    if (file === 'symptom-checker.html') {
        // Redirection to root index.html because SPA handles it
        fs.writeFileSync(path.join(publicPath, file), `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/" /></head><body></body></html>`);
        continue;
    }

    const content = fs.readFileSync(path.join(publicPath, file), 'utf8');
    
    // Extract title (<h1>Text</h1>)
    const titleMatch = content.match(/<h1>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : file.replace('.html', '').replace('-', ' ').toUpperCase();
    
    // Extract body of the section, avoiding the h1
    let body = '';
    const sectionMatch = content.match(/<section[^>]*>([\s\S]*?)<\/section>/i);
    if(sectionMatch) {
       body = sectionMatch[1];
       // remove the h1 from the body
       body = body.replace(/<h1>.*?<\/h1>/i, '');
    } else {
       body = "<p>Content goes here.</p>";
    }

    // Add CSS classes to the <p> and <ul> tags to enforce the sleek aesthetic
    body = body.replace(/<p>/g, '<p style="color: var(--text-secondary, #a1a1aa); font-size: 16px; line-height: 1.6; margin-bottom: 24px;">');
    body = body.replace(/<ul>/g, '<ul style="color: var(--text-secondary, #a1a1aa); font-size: 16px; line-height: 1.6; margin-bottom: 24px; padding-left: 20px;">');
    body = body.replace(/<h2>/g, '<h2 style="color: var(--text-primary, #ffffff); font-size: 24px; font-weight: 600; margin: 32px 0 16px 0;">');

    const newTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Know Your Body</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/Style/style.css"/>
    <style>
        .page-container {
            max-width: 800px;
            margin: 100px auto 40px auto;
            padding: 0 24px;
        }
        .page-title {
            font-size: 40px;
            font-weight: 700;
            margin-bottom: 24px;
            background: linear-gradient(135deg, #fff 0%, #a0a0A0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .text-card {
            background: var(--card-bg, #1e1f24);
            border: 1px solid var(--border, #2a2c33);
            border-radius: 16px;
            padding: 40px;
        }
        .text-card p strong {
            color: var(--accent, #62e59e);
            font-weight: 600;
        }
        @media (max-width: 768px) {
            .text-card { padding: 24px; }
        }
    </style>
</head>
<body>
    <header class="header" id="header">
        <a href="/" class="logo">
            <span class="logo-know">KNOW</span>
            <span class="logo-body">YOUR BODY</span>
        </a>
        <nav class="nav-menu">
            <ul>
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="/services.html" class="nav-link">Services</a></li>
                <li><a href="/contact-us.html" class="nav-link">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="page-container">
        <h1 class="page-title">${title}</h1>
        <div class="text-card">
            ${body.trim()}
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(path.join(publicPath, file), newTemplate);
    console.log("Updated", file);
}
console.log("All HTML files updated!");
