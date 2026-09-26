// components/Footer.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { useRef } from 'react';
import type { Icon } from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link'; // Next.js internal links

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.12,
      when: 'beforeChildren',
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const shimmer = {
  backgroundImage:
    'linear-gradient(90deg, transparent, var(--accent-glow), transparent)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 3.5s linear infinite',
};

const goldGradient =
  'bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent';

const Footer = () => {
  const ref = useRef<HTMLDivElement>(null);

const socialIcons = [
  { Icon: FaGithub, href: 'https://github.com/rakeshnitb23', label: 'GitHub' },
  { Icon: FaLinkedin, href: 'https://linkedin.com/in/rakesh-singh-58926a116', label: 'LinkedIn' },
  { Icon: FaEnvelope, href: 'mailto:rakeshnitb23@gmail.com', label: 'Email' },
];

  const navigationItems = [
    { name: 'Projects', href: '/projects' },
    { name: 'Writing', href: '/writing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Resume', href: '/resume.pdf' },
  ];

  return (
    <footer
      ref={ref}
      className="relative section-padding pt-0 lg:py-24  overflow-hidden"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg ... subtle grain texture here ...")',
        backgroundSize: '200px',
      }}
    >
      {/* Soft radial glow behind CTA */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-gold-500/10 via-transparent to-transparent blur-3xl opacity-60" />
      </div>

      <motion.div
        className="container-constrained relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={footerVariants}
      >


        {/* 2. Main Footer Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12"
          variants={childVariants}
        >
          {/* Column 1 – Brand */}
          <div>
            <div
              className={`text-4xl md:text-5xl font-serif font-bold ${goldGradient} mb-4`}
            >
              RS
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 text-base leading-relaxed">
              Backend engineering focused on scalable, production-ready
              architecture and high-throughput systems.
            </p>
           <div className="flex gap-5">
  {socialIcons.map(({ Icon, href, label }, i) => (
    <motion.a
      key={i}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      whileHover={{ y: -6, scale: 1.15 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors"
    >
      <Icon size={28} />
    </motion.a>
  ))}
</div>
          </div>

          {/* Column 2 – Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal-dark dark:text-ivory-light mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              {navigationItems.map((item) => {
                const isResume = item.name === 'Resume';
                return (
                  <motion.li
                    key={item.name}
                    whileHover={{ x: 6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {isResume ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors group relative inline-block"
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent/80 to-accent group-hover:w-full transition-all duration-400" />
                      </a>
                    ) : (
                      <Link href={item.href} className="hover:text-accent transition-colors group relative inline-block">
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent/80 to-accent group-hover:w-full transition-all duration-400" />
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Column 3 – Expertise */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal-dark dark:text-ivory-light mb-5">
              Expertise
            </h3>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              {[
                'Backend Architecture',
                'REST & API Design',
                'Performance Optimization',
                'Cloud Deployment',
                'Scalable CRM Systems',
              ].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 8, color: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 250 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Availability */}
          <div>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6   rounded-2xl bg-white/40 dark:bg-neutral-900/30 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <p className="font-medium text-charcoal-dark dark:text-ivory-light ">
                  Currently open to selective remote opportunities.
                </p>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Response time:{' '}
                <span className="text-accent">less than 24 hours</span>
              </p>
              <a
                href="mailto:rakeshnitb23@gmail.com"
                className={`font-medium ${goldGradient} hover:underline lg:text-sm  `}
              >
                rakeshnitb23@gmail.com
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Optional copyright */}
      <div className="text-center mt-16 text-neutral-500 dark:text-neutral-600 text-sm">
        © {new Date().getFullYear()} Rakesh Singh — Crafted with precision.
      </div>
    </footer>
  );
};

export default Footer;