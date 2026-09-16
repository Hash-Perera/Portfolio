'use client';

import { useRef, useState } from 'react';
import { portfolio, projects, otherProjects, skills, experience, education, publications } from './portfolio';

const navigation = [
  ['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects'],
  ['Skills', 'skills'], ['Résumé', 'resume'],
];

// Preserve the CV's newest-first ordering while grouping career progression by employer.
const companyExperience = [...new Set(experience.map(job => job.company))].map(company => {
  const roles = experience.filter(job => job.company === company);
  return {
    company,
    roles,
    current: roles.some(job => job.current),
    dates: `${roles[roles.length - 1].dates.split(' – ')[0]} – ${roles[0].dates.split(' – ')[1]}`,
    monogram: company === 'DigitusTec' ? 'DT' : 'IG',
  };
});

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className={`project-art ${project.color}`} aria-hidden="true">
      <div className="project-overview">
        <div className="overview-top"><span>{project.name}</span><span>WORKFLOW OVERVIEW</span></div>
        <h4>{project.label}</h4>
        {project.visual === 'mobile' ? (
          <div className="field-overview"><div className="phone-outline"><div className="phone-notch"/><span>OUTGROWER</span><strong>Ready for<br/>the field.</strong><div className="offline-pill">● Offline access</div><div className="phone-record"/><div className="phone-record"/></div><div className="field-facts"><strong>500+</strong><span>users enabled</span><small>Hive storage<br/>Queued sync<br/>Retry handling</small></div></div>
        ) : (
          <div className={`workflow-nodes ${project.visual}`}>
            {project.workflow.map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong><i/><i/></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const project = projects[selected];

  function toggleTheme() {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="brand" href="#main" aria-label={`${portfolio.name}, home`}>{portfolio.initials}<span>.</span></a>
      <nav id="navigation" className={menu ? 'nav open' : 'nav'} aria-label="Main navigation">
        {navigation.map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light or dark theme"><span className="moon" aria-hidden="true">☾</span><span className="sun" aria-hidden="true">☀</span></button>
        <a className="contact-link" href="#contact">Let’s talk ↗</a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button>
      </div>
    </header>

    <main id="main">
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot"/> SOFTWARE ENGINEER · 3+ YEARS OF EXPERIENCE</div>
          <p className="intro">Hi there, I’m <strong>{portfolio.name}</strong> <span className="wave">↗</span></p>
          <h1>Thoughtful code.<br/>Meaningful <em>experiences.</em></h1>
          <p className="hero-description">From enterprise .NET systems to Angular and NestJS platforms,<br className="desktop-break"/> I build, support, and ship software people can rely on.</p>
          <div className="button-row"><a className="button primary" href="#projects">Explore my work <span>↗</span></a><a className="button secondary" href={portfolio.resume} download="Hashan-Perera-Resume.pdf">Download résumé <span>↓</span></a></div>
          <div className="hero-foot"><span className="tiny-line"/> {portfolio.location} · Angular / React / .NET / NestJS / AWS</div>
          {(portfolio.github || portfolio.linkedin) && <div className="hero-socials">{portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}</div>}
        </div>
        <div className="hero-art" aria-label="Decorative code card introducing Hashan">
          <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
          <div className="floating-tag top-tag"><span className="status-dot"/> Built with intention</div>
          <div className="code-card"><div className="window-bar"><i/><i/><i/><span>hashan.ts</span><span>⌘</span></div>
            <div className="code-body"><p><span className="code-purple">const</span> developer = {'{'}</p><p className="indent">name: <span className="code-green">&apos;Hashan Perera&apos;</span>,</p><p className="indent">experience: <span className="code-green">&apos;3+ years&apos;</span>,</p><p className="indent">basedIn: <span className="code-green">&apos;Sri Lanka&apos;</span>,</p><p className="indent">focus: [</p><p className="double-indent code-green">&apos;Reliable systems&apos;,</p><p className="double-indent code-green">&apos;Real-world impact&apos;</p><p className="indent">],</p><p>{'}'};</p><p className="code-comment">{'// Always learning. Always building.'}</p></div>
          </div>
          <div className="floating-tag bottom-tag"><span className="spark">✳</span> Ideas → production-ready software</div><span className="art-plus">+</span>
        </div>
      </section>

      <div className="principles"><div className="container"><span>FROM IDEA TO IMPACT</span><p>Clean architecture <b>✳</b> Secure APIs <b>✳</b> Reliable systems <b>✳</b> Continuous learning</p></div></div>

      <section className="section container about" id="about">
        <div><p className="eyebrow">01 / A LITTLE ABOUT ME</p><h2>An engineer’s mind.<br/><span>A builder’s heart.</span></h2></div>
        <div className="about-copy"><p className="large-copy">{portfolio.about[0]}</p>{portfolio.about.slice(1).map(p => <p key={p}>{p}</p>)}
          <div className="about-stats"><div><strong>03<span>+</span></strong><small>Years of experience</small></div><div><strong>500<span>+</span></strong><small>Outgrower users enabled</small></div><div><strong>03</strong><small>Engineers on my lead project</small></div></div>
        </div>
      </section>

      <section className="section container" id="experience">
        <div className="section-heading"><div><p className="eyebrow">02 / THE JOURNEY SO FAR</p><h2>Experience that <span>builds.</span></h2></div><p>From trainee to leading delivery,<br/>and keeping enterprise systems reliable.</p></div>
        <div className="company-timeline">{companyExperience.map(company => <article className="company-history" key={company.company}>
          <header className="company-heading">
            <span className="company-monogram" aria-hidden="true">{company.monogram}</span>
            <div className="company-identity"><h3>{company.company}</h3><p>{company.dates}<span aria-hidden="true"> · </span>{company.roles.length === 1 ? '1 role' : `${company.roles.length} roles`}</p></div>
            {company.current && <span className="company-current"><span className="status-dot"/> Current</span>}
          </header>
          <ol className="role-timeline" aria-label={`Roles at ${company.company}, most recent first`}>
            {company.roles.map(job => <li className={`timeline-role${job.current ? ' is-current' : ''}`} key={job.role}>
              <div className="role-heading"><h4>{job.role}</h4><p className="role-dates">{job.dates}</p></div>
              <ul className="role-points">{job.overviewPoints.map(point => <li key={point}>{point}</li>)}</ul>
            </li>)}
          </ol>
        </article>)}</div>
      </section>

      <section className="section projects-section" id="projects"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">03 / SELECTED WORK</p><h2>Real challenges.<br/><span>Purposeful software.</span></h2></div><p>Enterprise platforms, tools for the field,<br/>and research that connects AI with real needs.</p></div>
        <div className="project-grid">{projects.map((item, index) => <article className="project-card" key={item.name}>
          <ProjectVisual project={item}/>
          <div className="project-info"><p className="eyebrow">{item.type}</p><h3>{item.name}<button onClick={() => { setSelected(index); dialog.current?.showModal(); }} aria-label={`Read about ${item.name}`}>↗</button></h3><p>{item.description}</p><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
        </article>)}</div>
        <div className="more-work"><p className="eyebrow">ALSO BUILT AT DIGITUSTEC</p><div className="other-project-grid">{otherProjects.map(item => <article key={item.name}><h3>{item.name}</h3><p>{item.description}</p><small>{item.stack}</small>{item.url && <a className="project-external" href={item.url} target="_blank" rel="noreferrer">Visit CYOL ↗</a>}</article>)}</div></div>
      </div></section>

      <section className="section container" id="skills">
        <div className="section-heading"><div><p className="eyebrow">04 / MY TOOLKIT</p><h2>The tools behind <span>the work.</span></h2></div><p>Grounded in engineering fundamentals.<br/>Always making room to learn.</p></div>
        <div className="skills-grid">{Object.entries(skills).map(([category, items], i) => <div className="skill-group" key={category}><span className="skill-number">0{i + 1}</span><h3>{category}</h3><div className="skill-items">{items.map(skill => <span key={skill}>{skill}</span>)}</div></div>)}</div>
      </section>

      <section className="section container learning-section" id="education">
        <div className="section-heading"><div><p className="eyebrow">05 / LEARNING & RESEARCH</p><h2>Curiosity, <span>put to work.</span></h2></div><p>A foundation in software engineering,<br/>with a growing interest in applied AI.</p></div>
        <div className="learning-grid"><div><h3 className="learning-label">Education</h3>{education.map(item => <article className="education-item" key={item.title}><span>{item.dates}</span><h4>{item.title}</h4>{item.subtitle && <p>{item.subtitle}</p>}<p>{item.institution}</p><strong>{item.result}</strong></article>)}</div>
          <div><h3 className="learning-label">Research & publications</h3>{publications.map(item => <article className="publication-item" key={item.title}><p className="eyebrow">{item.note}</p><h4>{item.title}</h4><p>{item.venue}</p>{item.url && <a className="project-external" href={item.url} target="_blank" rel="noreferrer">Read publication ↗</a>}</article>)}<div className="research-note"><span>✳</span><p><strong>InsureGeini</strong><br/>Final-year research project · Grade A · NBQSA selected</p></div></div>
        </div>
      </section>

      <section className="container resume-section" id="resume"><div className="resume-card">
        <div className="document-art" aria-hidden="true"><span>CV<span>↗</span></span><i/><i/><i/><div/><i/><i/></div>
        <div className="resume-copy"><p className="eyebrow">06 / TAKE IT WITH YOU</p><h2>The short version,<br/><span>on paper.</span></h2><p>My experience, skills, projects,<br/>and research in one place.</p></div>
        <div className="resume-actions"><a className="button primary" href={portfolio.resume} download="Hashan-Perera-Resume.pdf">Download résumé <span>↓</span></a><a className="text-link" href={portfolio.resume} target="_blank" rel="noreferrer">View résumé <span>↗</span></a><small>PDF · Hashan Perera</small></div>
      </div></section>

      <section className="section container contact-section" id="contact">
        <p className="eyebrow">07 / WHAT’S NEXT?</p><h2>Good things start<br/>with a <em>conversation.</em></h2><p>Have a project in mind, an interesting opportunity,<br/>or just want to say hello? I’d love to hear from you.</p>
        <a className="email-link" href={`mailto:${portfolio.email}`}>{portfolio.email} <span>↗</span></a>
        <div className="contact-details"><span>{portfolio.location}</span><span aria-hidden="true">·</span><a href={`tel:${portfolio.phoneHref}`}>{portfolio.phone}</a></div>
        <div className="social-links">{portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}</div>
      </section>
    </main>

    <footer className="container footer"><a className="brand" href="#main" aria-label="Back to the top">{portfolio.initials}<span>.</span></a><p>© {new Date().getFullYear()} {portfolio.name}. Built with care.</p><a href="#main">Back to top ↑</a></footer>

    <dialog ref={dialog} aria-labelledby="project-title" className="project-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div><p className="eyebrow">{project.type}</p><h2 id="project-title">{project.name}</h2><div className="project-meta"><span>{project.role}</span><span>{project.outcome}</span></div><p>{project.detail}</p><ul>{project.highlights.map(point => <li key={point}>{point}</li>)}</ul><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.url && <a className="project-external" href={project.url} target="_blank" rel="noreferrer">{project.linkLabel || 'Explore project'} ↗</a>}<form method="dialog"><button className="button primary">Close details ×</button></form></div>
    </dialog>
  </>;
}
