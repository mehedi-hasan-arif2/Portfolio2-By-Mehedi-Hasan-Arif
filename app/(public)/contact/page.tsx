import ContactForm from '@/components/sections/ContactForm'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch to discuss your next project.',
}

export default function ContactPage() {
  return (
    <div className="pt-20">
      <ContactForm />
    </div>
  )
}
