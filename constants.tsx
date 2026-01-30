
import React from 'react';
import { Feature, SocialLink } from './types';

export const LAUNCH_DATE = new Date();
LAUNCH_DATE.setDate(LAUNCH_DATE.getDate() + 30); // 30 days from now

export const FEATURES: Feature[] = [
  {
    title: "Web Development",
    description: "Curabitur elementum urna augue, eu porta purus gravida in.",
    details: "Our approach to web development merges aesthetic excellence with technical precision. We build scalable, high-performance web applications using the latest edge technologies to ensure your digital presence is as powerful as it is beautiful.",
    icon: "code"
  },
  {
    title: "App Mobile Design",
    description: "Suspendisse ac elit vitae est lacinia interdum eu sit amet mauris.",
    details: "Mobile experiences should be intuitive and frictionless. We specialize in creating cohesive design systems that translate seamlessly across platforms, focusing on micro-interactions and user psychology to drive engagement.",
    icon: "smartphone"
  },
  {
    title: "Cloud Security",
    description: "Duis porttitor libero ac egestas euismod. Maecenas quis felis turpis.",
    details: "Security is the bedrock of digital trust. Our cloud solutions implement zero-trust architectures and continuous monitoring to protect your data assets from evolving threats while maintaining peak operational efficiency.",
    icon: "shield"
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', icon: 'fb', url: 'https://www.facebook.com' },
  { label: 'Twitter', icon: 'tw', url: 'https://twitter.com' },
  { label: 'Instagram', icon: 'ig', url: 'https://www.instagram.com' },
  { label: 'LinkedIn', icon: 'li', url: 'https://www.linkedin.com' }
];

export const CONTACT_INFO = {
  address: "90 Queen St Melbourne Vic AU",
  phone: "info@automy.in",
  email: "info@automy.in"
};
