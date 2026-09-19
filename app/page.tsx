'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { portfolio, projects, otherProjects, skills, experience, education, publications } from './portfolio';

const navigation = [
  ['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects'],
  ['Skills', 'skills'], ['Research', 'education'], ['Résumé', 'resume'],
];
const projectCategories = ['All', 'Web', 'Mobile', 'Research', 'AI'] as const;
type ProjectCategory = (typeof projectCategories)[number];

// Preserve the CV's newest-first ordering while grouping career progression by employer.
const companyExperience = [...new Set(experience.map(job => job.company))].map(company => {
  const roles = experience.filter(job => job.company === company);
  return {
    company,
    roles,
    current: roles.some(job => job.current),
    dates: `${roles[roles.length - 1].dates.split(' – ')[0]} – ${roles[0].dates.split(' – ')[1]}`,
    logo: company === 'DigitusTec' ? '/companies/digitustec.jpg' : '/companies/igt1.jpg',
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
  const [activeSection, setActiveSection] = useState('');
  const [selected, setSelected] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const portrait = useRef<HTMLElement>(null);
  const portraitFrame = useRef<number>(0);
  const project = projects[selected];
  const filteredProjects = projects
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => selectedCategory === 'All' || item.categories.includes(selectedCategory));

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      let current = '';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 160) current = section.id;
      }
      setActiveSection(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateActive); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.section-heading, .about-copy, .experience-container, .project-card, .skill-group, .learning-grid, .resume-card'));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
    if (!reducedMotion.matches) elements.forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('reveal-pending');
        observer.observe(element);
      }
    });
    const onMotionChange = () => { if (reducedMotion.matches) { elements.forEach(element => element.classList.add('is-visible')); observer.disconnect(); } };
    reducedMotion.addEventListener('change', onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', closeMenu);
    return () => window.removeEventListener('keydown', closeMenu);
  }, [menu]);

  function toggleTheme() {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme-v2', theme); } catch {}
  }

  function updatePortraitDepth(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(max-width: 850px)').matches) return;
    const element = portrait.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2)));
    cancelAnimationFrame(portraitFrame.current);
    portraitFrame.current = requestAnimationFrame(() => {
      element.style.setProperty('--depth-x', x.toFixed(3));
      element.style.setProperty('--depth-y', y.toFixed(3));
    });
  }

  function resetPortraitDepth() {
    const element = portrait.current;
    if (!element) return;
    element.style.setProperty('--depth-x', '0');
    element.style.setProperty('--depth-y', '0');
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="brand" href="#main" aria-label={`${portfolio.name}, home`}><span className="brand-bracket">&lt;</span>{portfolio.initials}<span className="brand-bracket"> /&gt;</span></a>
      <nav id="navigation" className={menu ? 'nav open' : 'nav'} aria-label="Main navigation">
        {navigation.map(([name, id]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light or dark theme"><span className="moon" aria-hidden="true">☾</span><span className="sun" aria-hidden="true">☀</span></button>
        <a className="contact-link" href="#contact">Let’s talk ↗</a>
        <button ref={menuButton} className="menu-toggle" aria-label="Toggle navigation" aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button>
      </div>
    </header>

    <main id="main">
      <section className="hero container">
        <div className="hero-nodes" aria-hidden="true">
          <i><span>+</span></i><i><span>□</span></i><i><span>◇</span></i>
          <i><span>&lt;&gt;</span></i><i><span>•</span></i><i><span>[ ]</span></i>
        </div>
        <div className="hero-copy">
          <div className="eyebrow hero-enter hero-enter-1"><span className="status-dot"/> SOFTWARE ENGINEER / SRI LANKA</div>
          <h1><span className="hero-name hero-enter hero-enter-2">Hashan</span><br/><span className="hero-enter hero-enter-3"><span className="gradient-text">Perera<span className="name-period">.</span></span></span></h1>
          <p className="hero-lead hero-enter hero-enter-4">Thoughtful code.<br/>Meaningful experiences.</p>
          <p className="hero-description hero-enter hero-enter-5">From enterprise .NET systems to Angular and NestJS platforms,<br className="desktop-break"/> I build, support, and ship software people can rely on.</p>
          <div className="button-row hero-enter hero-enter-6"><a className="button primary" href="#projects">Explore my work <span>↗</span></a><a className="button secondary" href={portfolio.resume} download="Hashan-Perera-Resume.pdf">Download résumé <span>↓</span></a></div>
          <div className="hero-foot hero-enter hero-enter-7"><span className="tiny-line"/> FULL-STACK · CLOUD · AI-ASSISTED DEVELOPMENT</div>
          {(portfolio.github || portfolio.linkedin) && <div className="hero-socials">{portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}</div>}
        </div>
        {portfolio.portrait ? <figure ref={portrait} className="hero-portrait hero-enter hero-enter-8" onPointerMove={updatePortraitDepth} onPointerLeave={resetPortraitDepth}>
          <div className="portrait-label"><span>01 / THE ENGINEER</span><span className="portrait-cross" aria-hidden="true">+</span></div>
          <div className="portrait-surround">
            <span className="portrait-orbit" aria-hidden="true"/>
            <span className="portrait-orbit portrait-orbit-outer" aria-hidden="true"/>
            <div className="portrait-frame"><Image src={portfolio.portrait} alt="Hashan Perera" width={1666} height={2082} priority unoptimized className="portrait-photo" /></div>
          </div>
          <figcaption><span><strong>3+</strong> YEARS OF EXPERIENCE</span><span>BUILDING WITH<br/><b>Purpose & precision.</b></span></figcaption>
        </figure> : <div className="hero-art" aria-label="Decorative code card introducing Hashan">
          <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
          <div className="floating-tag top-tag"><span className="status-dot"/> Built with intention</div>
          <div className="code-card"><div className="window-bar"><i/><i/><i/><span>hashan.ts</span><span>⌘</span></div>
            <div className="code-body"><p><span className="code-purple">const</span> developer = {'{'}</p><p className="indent">name: <span className="code-green">&apos;Hashan Perera&apos;</span>,</p><p className="indent">experience: <span className="code-green">&apos;3+ years&apos;</span>,</p><p className="indent">basedIn: <span className="code-green">&apos;Sri Lanka&apos;</span>,</p><p className="indent">focus: [</p><p className="double-indent code-green">&apos;Reliable systems&apos;,</p><p className="double-indent code-green">&apos;Real-world impact&apos;</p><p className="indent">],</p><p>{'}'};</p><p className="code-comment">{'// Always learning. Always building.'}</p></div>
          </div>
          <div className="floating-tag bottom-tag"><span className="spark">✳</span> Ideas → production-ready software</div><span className="art-plus">+</span>
        </div>}
      </section>

      <div className="principles"><div className="container"><span>THE ENGINEERING MINDSET</span><p>Clean architecture <b>/</b> Secure APIs <b>/</b> Reliable systems <b>/</b> Continuous learning</p></div></div>

      <section className="section container about" id="about">
        <div><p className="eyebrow">01 / A LITTLE ABOUT ME</p><h2>An engineer’s mind.<br/><span>A builder’s heart.</span></h2></div>
        <div className="about-copy"><p className="large-copy">{portfolio.about[0]}</p>{portfolio.about.slice(1).map(p => <p key={p}>{p}</p>)}
          <div className="about-stats"><div><strong>03<span>+</span></strong><small>Years of experience</small></div><div><strong>500<span>+</span></strong><small>Outgrower users enabled</small></div><div><strong>03</strong><small>Engineers on my lead project</small></div></div>
        </div>
      </section>

      <section className="section container" id="experience">
        <div className="section-heading"><div><p className="eyebrow">02 / THE JOURNEY SO FAR</p><h2>Experience that <span>builds.</span></h2></div><p>From trainee to leading delivery,<br/>and keeping enterprise systems reliable.</p></div>
        <div className="experience-container">{companyExperience.map(company => <article className="company-history" key={company.company}>
          <header className="company-heading">
            <Image className="company-logo" src={company.logo} alt={`${company.company} logo`} width={52} height={52} unoptimized />
            <div className="company-identity"><h3>{company.company}</h3><p>{company.dates}<span aria-hidden="true"> · </span>{company.roles.length === 1 ? '1 role' : `${company.roles.length} roles`}</p></div>
            {company.current && <span className="company-current"><span className="status-dot"/> Current</span>}
          </header>
          <ol className="role-timeline" aria-label={`Roles at ${company.company}, most recent first`}>
            {company.roles.map(job => <li className={`timeline-role${job.current ? ' is-current' : ''}`} key={job.role}>
              <div className="role-heading"><h4>{job.role}</h4><p className="role-dates">{job.dates}</p></div>
              <p className="role-summary">{job.summary}</p>
              {job.tags.length > 0 && <ul className="role-technologies" aria-label={`Tools and technologies used as ${job.role} at ${job.company}`}>{job.tags.map(technology => <li key={technology}>{technology}</li>)}</ul>}
              {job.responsibilityGroups.length > 0 && <details className="role-details">
                <summary>Responsibilities and Achievements <svg className="details-chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></summary>
                <div className="role-details-content">{job.responsibilityGroups.map((group, index) => <div className="responsibility-group" key={group.title || index}>
                  {group.title && <h5>{group.title}</h5>}
                  {group.technologies.length > 0 && <p className="responsibility-stack">{group.technologies.join(' · ')}</p>}
                  <ul className="role-points">{group.points.map(point => <li key={point}>{point}</li>)}</ul>
                </div>)}</div>
              </details>}
            </li>)}
          </ol>
        </article>)}</div>
      </section>

      <section className="section projects-section" id="projects"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">03 / SELECTED WORK</p><h2>Real challenges.<br/><span>Purposeful software.</span></h2></div><p>Enterprise platforms, tools for the field,<br/>and research that connects AI with real needs.</p></div>
        <div className="project-filters" role="toolbar" aria-label="Filter projects by category">
          {projectCategories.map(category => <button type="button" key={category} aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category}</button>)}
        </div>
        <div className="project-grid" key={selectedCategory} data-filter={selectedCategory}>{filteredProjects.map(({ item, index }) => <article className="project-card" key={item.name}>
          <ProjectVisual project={item}/>
          <div className="project-info"><p className="eyebrow">{item.type}</p><h3>{item.name}<button onClick={() => { setSelected(index); dialog.current?.showModal(); }} aria-label={`Read about ${item.name}`}>↗</button></h3><p>{item.description}</p><div className="project-contribution"><span>{item.role}</span><span>{item.outcome}</span></div><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{item.url && <a className="project-external" href={item.url} target="_blank" rel="noreferrer">{item.linkLabel || 'Explore project'} ↗</a>}</div>
        </article>)}</div>
        <div className="more-work"><p className="eyebrow">ALSO BUILT AT DIGITUSTEC</p><div className="other-project-grid">{otherProjects.map(item => <article key={item.name}><h3>{item.name}</h3><p>{item.description}</p><small>{item.stack}</small>{item.url && <a className="project-external" href={item.url} target="_blank" rel="noreferrer">Visit CYOL ↗</a>}</article>)}</div></div>
      </div></section>

      <section className="section container" id="skills">
        <div className="section-heading"><div><p className="eyebrow">04 / MY TOOLKIT</p><h2>The tools behind <span>the work.</span></h2></div><p>Grounded in engineering fundamentals.<br/>Always making room to learn.</p></div>
        <div className="skills-grid">{Object.entries(skills).map(([category, items], i) => <div className="skill-group" key={category}><div className="skill-top"><span className="skill-symbol" aria-hidden="true">{['{ }', '</>', '↔', '▤', '☁', '✓', '✳', 'λ'][i]}</span><span className="skill-number">0{i + 1}</span></div><h3>{category}</h3><div className="skill-items">{items.map(skill => <span key={skill}>{skill}</span>)}</div></div>)}</div>
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
      <div><p className="eyebrow">{project.type}</p><h2 id="project-title">{project.name}</h2>
        <div className="dialog-section"><h3>Problem</h3><p>{project.problem}</p></div>
        <div className="dialog-section"><h3>What I Did</h3><p>{project.whatIDid}</p></div>
        <div className="dialog-section"><h3>Architecture Overview</h3><div className="dialog-architecture">{project.architecture.map((node, index) => <span key={node}>{node}{index < project.architecture.length - 1 && <i aria-hidden="true">→</i>}</span>)}</div></div>
        <div className="dialog-section dialog-role"><h3>Role</h3><strong>{project.role}</strong><p>{project.roleDescription}</p></div>
        <div className="dialog-section"><h3>Technologies</h3><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
        {project.url && <a className="project-external" href={project.url} target="_blank" rel="noreferrer">{project.linkLabel || 'Explore project'} ↗</a>}<form method="dialog"><button className="button primary">Close details ×</button></form></div>
    </dialog>
  </>;
}
