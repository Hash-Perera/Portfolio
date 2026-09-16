import PDFDocument from 'pdfkit';
import { createWriteStream, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';

const content = JSON.parse(readFileSync(new URL('../app/content.json', import.meta.url), 'utf8'));
const { portfolio, experience, projects, otherProjects, education, publications } = content;
const output = new URL('../public/resume.pdf', import.meta.url);
const reviewDir = new URL('../tmp/pdfs/', import.meta.url);
mkdirSync(reviewDir, { recursive: true });
const doc = new PDFDocument({ size: 'A4', margins: { top: 48, bottom: 55, left: 48, right: 48 }, bufferPages: true, info: { Title: `${portfolio.name} - Software Engineer`, Author: portfolio.name, Subject: 'Professional experience, skills, projects, education, and research' } });
const bodyFont = process.env.RESUME_FONT_REGULAR || 'C:/Windows/Fonts/arial.ttf';
const boldFont = process.env.RESUME_FONT_BOLD || 'C:/Windows/Fonts/arialbd.ttf';
doc.registerFont('Body', existsSync(bodyFont) ? bodyFont : 'Helvetica');
doc.registerFont('Heading', existsSync(boldFont) ? boldFont : 'Helvetica-Bold');
const stream = createWriteStream(output);
doc.pipe(stream);
const left = 48, width = 499, ink = '#24272b', muted = '#58616c', blue = '#4265e8';
let y = 48;
const ascii = text => text.replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

function text(value, {size = 9.5, color = ink, bold = false, gap = 6, indent = 0, link} = {}) {
  doc.font(bold ? 'Heading' : 'Body').fontSize(size).fillColor(color);
  const currentPage = doc.page;
  doc.text(ascii(value), left + indent, y, {width: width - indent, lineGap: 1.5, ...(link ? {link, underline:true} : {})});
  if(doc.page !== currentPage) throw new Error(`Unexpected page break: ${value.slice(0,60)}`);
  y = doc.y + gap;
  if (y > 788) throw new Error(`Resume text exceeds the page boundary: ${value.slice(0,60)}`);
}
function section(title) {
  y += 8;
  doc.moveTo(left, y).lineTo(left + width, y).strokeColor('#dfe3e9').stroke();
  y += 12;
  text(title.toUpperCase(), {size:9, color:blue, bold:true, gap:9});
}
function heading(title, subtitle) {
  text(title,{size:12,bold:true,gap:4});
  if(subtitle) text(subtitle,{size:9,color:muted,gap:7});
}
function bullet(value) { text(`- ${value}`, {indent:6, gap:5}); }
function page(label) {
  doc.addPage(); y = 46;
  text(portfolio.name.toUpperCase(), {size:10,bold:true,gap:3});
  text(label, {size:9,color:muted,gap:9});
}

text(portfolio.name.toUpperCase(), {size:29,bold:true,gap:6});
text('Software Engineer | Angular | React | .NET | NestJS | AWS', {size:11,color:blue,gap:9});
text(`${portfolio.location} | ${portfolio.phone}`, {size:9,color:muted,gap:3});
text(portfolio.email, {size:9,color:muted,gap:3,link:`mailto:${portfolio.email}`});
for (const [label, url] of [['LinkedIn',portfolio.linkedin],['GitHub',portfolio.github]]) {
  if(url) text(`${label}: ${url}`, {size:8.5,color:blue,gap:3,link:url});
}
section('Profile');
text(`${portfolio.summary} Strong foundation in OOP, SOLID principles, REST API design, secure application development, automated testing, Git workflows, and CI/CD. Experienced in .NET debugging, production root-cause analysis, and enterprise SAP B1 integrations. Uses AI-assisted development tools for coding, debugging, refactoring, and quality improvement, and contributes within Agile engineering teams.`, {gap:6});
section('Technical skills');
const skillRows = [
  ['Languages', 'C#, JavaScript, TypeScript; working knowledge of Java and Python.'],
  ['Engineering', 'OOP, SOLID, design patterns, data structures and algorithms, REST API design.'],
  ['Backend', 'ASP.NET / .NET, NestJS, Express.js.'],
  ['Frontend & mobile', 'Angular, React, Next.js, React Native (Expo); Flutter, GetX, Hive.'],
  ['Databases', 'MS SQL Server, MySQL, PostgreSQL, MongoDB.'],
  ['APIs & security', 'RESTful APIs, GraphQL, WebSockets, JWT, Auth0, RBAC.'],
  ['Cloud & DevOps', 'AWS EC2, ECR, ECS, S3, CloudWatch; Docker, GitHub, GitLab, GitHub Actions, CI/CD, Git branching.'],
  ['Testing & quality', 'xUnit, Jest, Jasmine, Karma, Postman, Swagger, SonarQube, unit testing.'],
  ['ERP & CMS', 'SAP Business One (Service Layer), Sitecore XP.'],
  ['AI-assisted development', 'GitHub Copilot, Claude Code, Cursor, Antigravity, Codex, LLM prompt design, agentic development, refactoring, test generation.'],
];
for(const [label,value] of skillRows) text(`${label}: ${value}`, {size:9,gap:5});
section('Professional experience');
const current = experience[0];
heading(`${current.role} | ${current.company}`, current.dates);
for(const point of current.highlights) bullet(point);

page('Professional experience continued');
section('DigitusTec');
heading('Software Engineer', 'July 2025 - April 2026');
heading('Meeting Minutes Platform', 'Angular | NestJS | MongoDB | Docker | Auth0 | AWS');
text('Led end-to-end development as Lead Developer for a three-engineer team, defining Angular architecture, project structure, CI/CD workflows, and regular code reviews.');
for(const point of projects[0].highlights) bullet(point);
for(const item of otherProjects) {
  y += 6;
  heading(item.name, item.stack.replaceAll('·','|'));
  text(item.description, {gap:6});
  if(item.url) text(item.url,{size:8.5,color:blue,link:item.url,gap:6});
}
section('Earlier roles');
heading('Associate Software Engineer | DigitusTec', 'January 2024 - June 2025');
text('OUTGROWER Mobile App (Zambia) | Flutter | NestJS | MongoDB | Hive | SAP B1', {size:9,bold:true});
for(const point of experience[2].highlights) bullet(point);
y += 8;
heading('Trainee Software Engineer | DigitusTec', 'June 2023 - December 2023');

page('Projects, education & research');
section('Freelance & professional projects');
heading('Patient Management System', 'Next.js | MongoDB | Vercel');
text('Developed a live patient management system for Colombo University to manage digital medical records, with secure data handling and record management features.');
y += 8;
heading('InsureGeini', 'Final-year research project | Grade A | NBQSA selected');
text(projects[3].detail);
text('Technologies: AI, ML, NLP, OCR, YOLO, VGG16, DeepFace, CNN, Colab, Python, microservices, AWS ECS, Docker, CI/CD, GitHub, RabbitMQ.', {size:9,color:muted});
if(projects[3].url) text(projects[3].url, {size:9,color:blue,link:projects[3].url});
section('Education');
for(const item of education) {
  heading(item.title, `${item.dates} | ${item.institution}`);
  text([item.subtitle, item.result].filter(Boolean).join(' | '), {size:9.5,gap:13});
}
section('Research & publications');
for(const item of publications) {
  heading(item.title, item.venue);
  text(item.note, {size:9,color:muted,gap:13});
  if(item.url) text(item.url, {size:8.5,color:blue,link:item.url});
}

const range = doc.bufferedPageRange();
for(let index = range.start; index < range.start + range.count; index++) {
  doc.switchToPage(index);
  doc.font('Body').fontSize(8).fillColor(muted).text(`${portfolio.name} | Software Engineer`, left, 804, {lineBreak:false});
  doc.text(`${index + 1} / ${range.count}`, 500, 804, {lineBreak:false});
}
doc.end();
await new Promise((resolve,reject) => {stream.on('finish',resolve);stream.on('error',reject);});

Object.assign(globalThis,{DOMMatrix,ImageData,Path2D});
const {getDocument} = await import('pdfjs-dist/legacy/build/pdf.mjs');
const pdf = await getDocument({data:new Uint8Array(readFileSync(output)),useSystemFonts:true}).promise;
let extracted = '';
for(let index = 1; index <= pdf.numPages; index++) {
  const pdfPage = await pdf.getPage(index);
  const viewport = pdfPage.getViewport({scale:1.4});
  const canvas = createCanvas(viewport.width,viewport.height);
  await pdfPage.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
  writeFileSync(new URL(`resume-page-${index}.png`,reviewDir),canvas.toBuffer('image/png'));
  const textContent = await pdfPage.getTextContent();
  extracted += textContent.items.map(item => item.str || '').join(' ') + '\n';
}
for(const required of ['HASHAN PERERA','500+','IGT1 Lanka','InsureGeini','Second Class Upper','ICECET','hashperera.v@gmail.com']) {
  if(!extracted.includes(required)) throw new Error(`Missing resume content: ${required}`);
}
if(pdf.numPages !== 3) throw new Error(`Expected 3 resume pages; got ${pdf.numPages}`);
console.log(`Created and rendered ${pdf.numPages} pages; required CV details verified.`);
