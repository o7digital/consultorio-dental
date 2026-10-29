export type Language = 'es' | 'en';
export type PageKind = 'home' | 'privacy';

export const routes = {
  home: { es: '/', en: '/en/' },
  privacy: { es: '/aviso-de-privacidad', en: '/en/privacy-notice' },
} as const;

export const contact = {
  brand: 'Consultorio Dental Satélite',
  street: 'Circuito Historiadores S 44, Local 3',
  locality: 'Ciudad Satélite, Naucalpan',
  phone: '55 5393 8629',
  phoneHref: 'tel:+525553938629',
  whatsapp: '55 3436 0587',
  whatsappHref: 'https://wa.me/525534360587',
  instagram: 'https://www.instagram.com/consultorio_dental_satelite/',
} as const;

export const labels = {
  es: {
    home: 'Inicio',
    language: 'Idioma',
    menu: 'Abrir menú',
    navigation: 'Navegación principal',
    treatments: 'Tratamientos',
    about: 'Nosotros',
    team: 'Equipo',
    contact: 'Contacto',
    appointment: 'Agendar cita',
    backToContact: 'Volver al contacto ↗',
    backToHome: 'Volver al inicio',
    visit: 'VISÍTANOS',
    footerContact: 'CONTACTO',
    privacy: 'Aviso de privacidad',
    instagram: 'Consultorio Dental Satélite en Instagram',
    phone: 'Llamar por teléfono',
    whatsapp: 'Contactar por WhatsApp',
  },
  en: {
    home: 'Home',
    language: 'Language',
    menu: 'Open menu',
    navigation: 'Main navigation',
    treatments: 'Treatments',
    about: 'About us',
    team: 'Team',
    contact: 'Contact',
    appointment: 'Book an appointment',
    backToContact: 'Back to contact ↗',
    backToHome: 'Back to home',
    visit: 'VISIT US',
    footerContact: 'CONTACT',
    privacy: 'Privacy notice',
    instagram: 'Consultorio Dental Satélite on Instagram',
    phone: 'Call by phone',
    whatsapp: 'Contact us on WhatsApp',
  },
} as const;
