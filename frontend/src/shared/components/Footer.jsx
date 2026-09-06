import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socials = [
    { name: 'GitHub', href: 'https://github.com' },
    { name: 'LinkedIn', href: 'https://linkedin.com' },
    { name: 'Twitter', href: 'https://twitter.com' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border-t border-gray-100 mt-20"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-500 text-sm"
          >
            &copy; {currentYear} DevPortfolio. All rights reserved.
          </motion.div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                whileHover={{ y: -3, scale: 1.05 }}
                className="text-gray-400 hover:text-gray-600"
              >
                {s.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;