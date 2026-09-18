import type { Metadata } from 'next'
import { LegalPage } from '@/components/wrapped/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — Wrapsy',
  description: 'How Wrapsy collects, uses, and protects your information.',
}

const sections = [
  {
    title: 'Information we collect',
    paragraphs: [
      'When you create a Wrap, you may provide your name, phone number, story details, dates, locations, photos, and other memories. We also collect the information needed to save, display, and share your Wrap.',
      'When you use paid features, our payment provider processes payment details. Wrapsy does not receive or store your full card number or card security code.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use your information to create, save, personalize, and deliver your Wrap; provide customer support; process payments; prevent abuse; maintain service security; and improve reliability and product experience.',
      'Your submitted story and media may be sent to infrastructure and AI providers that help us generate copy, images, or other Wrap features. We only use those providers for the services they provide to Wrapsy.',
    ],
  },
  {
    title: 'Sharing and service providers',
    paragraphs: [
      'We use trusted service providers for hosting and database storage, analytics, error monitoring, payment processing, authentication, and AI-assisted generation. Those providers process information on our behalf and may have their own privacy policies.',
      'We do not sell your personal information. We may disclose information when required by law, to protect users or the service, or as part of a business transfer such as a merger or acquisition.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'You can contact us to request access to, correction of, or deletion of personal information associated with your Wrap. We may need to verify your identity before completing a request.',
      'You can stop using the service at any time. Some information may need to be retained when required for legal, security, fraud-prevention, or accounting purposes.',
    ],
  },
  {
    title: 'Cookies and analytics',
    paragraphs: [
      'Wrapsy and its providers may use cookies, local storage, or similar technologies to keep the service working, remember preferences, understand usage, and diagnose errors. You can control some of these technologies through your browser settings.',
    ],
  },
  {
    title: 'Security and retention',
    paragraphs: [
      'We use reasonable technical and organizational safeguards, but no online service can guarantee absolute security. We retain information only for as long as needed for the purposes described here, unless a longer period is required by law or a legitimate operational need.',
    ],
  },
  {
    title: 'Children and changes',
    paragraphs: [
      'Wrapsy is not directed to children under 13. If you believe a child has submitted personal information, contact us so we can investigate and remove it where appropriate.',
      'We may update this policy as the service changes. We will publish the updated version on this page and update the date above.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Wrapsy / Privacy"
      title="Your story is yours."
      intro="This policy explains what we collect, why we use it, and the choices you have when you turn your memories into a Wrap."
      updated="September 19, 2026"
      sections={sections}
    />
  )
}
