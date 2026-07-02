import React from 'react';
import { SiteNav } from './SiteNav.jsx';
import { Hero } from './Hero.jsx';
import { WorkSection } from './WorkSection.jsx';
import { AboutSection } from './AboutSection.jsx';
import { ExperienceSection } from './ExperienceSection.jsx';
import { ContactSection } from './ContactSection.jsx';
import { AskSection } from './AskSection.jsx';
import { Reveal } from './Reveal.jsx';
import { CommandMenu } from '../../components/patterns/CommandMenu.jsx';
import { SpecsOverlay } from '../../components/patterns/SpecsOverlay.jsx';

const HOME_CSS = `
.pf-container { max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); }
.pf-home { padding-bottom: 0; }
`;

if (typeof document !== 'undefined' && !document.getElementById('pf-home-css')) {
  const s = document.createElement('style'); s.id = 'pf-home-css'; s.textContent = HOME_CSS;
  document.head.appendChild(s);
}

export function Home() {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const EMAIL = 'hamid.ettefagh@gmail.com';
  const commands = [
    { label: 'Go to work', hint: '01', action: () => scrollToId('work') },
    { label: 'Ask my agent', hint: 'AI', action: () => { scrollToId('ask'); setTimeout(() => window.dispatchEvent(new Event('pf-ask-focus')), 450); } },
    { label: 'Go to about', hint: '02', action: () => scrollToId('about') },
    { label: 'Go to experience', hint: '03', action: () => scrollToId('experience') },
    { label: 'Go to contact', hint: '04', action: () => scrollToId('contact') },
    { label: 'Copy email', hint: '@', action: () => { try { navigator.clipboard.writeText(EMAIL); } catch (e) { /* noop */ } }, confirm: 'Copied ' + EMAIL },
    { label: 'View specs', hint: '.', action: () => window.dispatchEvent(new Event('pf-specs-open')) },
    { label: 'Open LinkedIn', hint: String.fromCharCode(8599), action: () => window.open('https://www.linkedin.com/in/hamidettefagh', '_blank') }
  ];
  return (
    <div className="pf-home">
      <SiteNav
        cmdk
        links={[
          { href: '#work', label: 'Work' },
          { href: '#about', label: 'About' },
          { href: '#experience', label: 'Experience' },
          { href: '#contact', label: 'Contact' }
        ]}
      />
      <div className="pf-container">
        <Hero />
        <Reveal><WorkSection /></Reveal>
        <Reveal><AskSection /></Reveal>
        <Reveal><AboutSection /></Reveal>
        <Reveal><ExperienceSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </div>
      <CommandMenu items={commands} />
      <SpecsOverlay />
    </div>
  );
}
