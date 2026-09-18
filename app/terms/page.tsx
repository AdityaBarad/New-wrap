import type { Metadata } from 'next'
import { LegalPage } from '@/components/wrapped/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — Wrapsy',
  description: 'The terms that apply when you use Wrapsy.',
}

const sections = [
  {
    title: 'Using Wrapsy',
    paragraphs: [
      'Wrapsy helps you turn personal memories and media into a shareable digital experience. By using Wrapsy, you agree to use the service lawfully and in a way that does not harm other people, the service, or its providers.',
      'You are responsible for the information and media you submit, for keeping access to your account or Wrap links secure, and for making sure you have permission to upload and share anything included in your Wrap.',
    ],
  },
  {
    title: 'User content',
    paragraphs: [
      'You retain ownership of the photos, stories, and other content you submit. You give Wrapsy the limited permissions needed to host, process, transform, display, and deliver that content as part of the service.',
      'Do not submit content that is illegal, abusive, infringing, deceptive, invasive of another person’s privacy, or harmful to children. We may remove content or suspend access when necessary to protect users or the service.',
    ],
  },
  {
    title: 'AI-assisted features',
    paragraphs: [
      'Some Wrap features use automated or AI-assisted systems. Generated copy, images, classifications, and other outputs may be inaccurate, unexpected, or unsuitable. Review outputs before relying on or sharing them.',
      'You remain responsible for the final content you publish or share, including any claims, images, names, or personal information it contains.',
    ],
  },
  {
    title: 'Payments and refunds',
    paragraphs: [
      'Some Wrap features may require payment. Prices, taxes, and available plans are shown at checkout. Payments are processed by our payment provider and are subject to its terms as well as these terms.',
      'If a purchase fails, is duplicated, or does not deliver the promised feature, contact us at admin@wrapsy.co with the relevant order details so we can investigate and determine the appropriate resolution.',
    ],
  },
  {
    title: 'Intellectual property',
    paragraphs: [
      'Wrapsy, including its branding, software, design, templates, and underlying technology, is owned by Wrapsy or its licensors. These terms do not give you ownership of Wrapsy’s intellectual property. You may use your completed Wrap for personal and lawful sharing, subject to the rights of the people and media included in it.',
    ],
  },
  {
    title: 'Availability and changes',
    paragraphs: [
      'We work to keep Wrapsy available, but the service may change, be interrupted, or be discontinued. We may update features, pricing, content, or these terms as the product develops. Continued use after an update means you accept the updated terms.',
    ],
  },
  {
    title: 'Disclaimers and limits',
    paragraphs: [
      'Wrapsy is provided on an “as available” basis. To the extent permitted by law, we do not promise that the service will be uninterrupted, error-free, or that generated content will be accurate or meet a particular purpose.',
      'To the extent permitted by law, Wrapsy will not be responsible for indirect, incidental, special, consequential, or punitive losses arising from your use of the service. Nothing in these terms limits rights that cannot legally be limited.',
    ],
  },
  {
    title: 'Contact and termination',
    paragraphs: [
      'You may stop using Wrapsy at any time. We may suspend or terminate access when these terms are violated, when required by law, or when needed to protect the service and its users.',
      'Questions about these terms can be sent to admin@wrapsy.co.',
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Wrapsy / Terms"
      title="Make memories. Use it right."
      intro="These terms explain the rules for using Wrapsy, submitting content, purchasing features, and sharing the Wraps you create."
      updated="September 19, 2026"
      sections={sections}
    />
  )
}
