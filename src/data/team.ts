import type { Language } from './site';

interface TeamMember {
  title?: string;
  name: string;
  role: Record<Language, string>;
  qualification: Record<Language, string>;
  license?: string;
  university?: string;
}

export const teamMembers: TeamMember[] = [
  {
    title: 'CD',
    name: 'Lourdes Carrillo Rojas',
    role: { es: 'Responsable del consultorio', en: 'Dentist in charge' },
    qualification: { es: 'Cirujano Dentista', en: 'Dental surgeon' },
    license: '1624170',
    university: 'UNAM',
  },
  {
    title: 'LO',
    name: 'Karen Jiménez Márquez',
    role: { es: 'Atención dental', en: 'Dental care' },
    qualification: { es: 'Licenciada en Odontología', en: 'Degree in dentistry' },
    license: '11940440',
    university: 'UCAD',
  },
  {
    title: 'CD',
    name: 'Xóchitl Felix Roldán',
    role: { es: 'Atención dental', en: 'Dental care' },
    qualification: { es: 'Cirujano Dentista', en: 'Dental surgeon' },
    license: '15202278',
    university: 'UNAM',
  },
  {
    title: 'CDEO',
    name: 'Juan Carlos Cervantes Riquelme',
    role: { es: 'Ortodoncia', en: 'Orthodontics' },
    qualification: {
      es: 'Cirujano dentista especialista en ortodoncia',
      en: 'Dental surgeon specializing in orthodontics',
    },
    license: '9822972',
    university: 'UNITEC',
  },
  {
    title: 'CD',
    name: 'Cesar Ojeda Vallesillo',
    role: { es: 'Cirugía maxilofacial', en: 'Maxillofacial surgery' },
    qualification: { es: 'Cirujano maxilofacial', en: 'Oral and maxillofacial surgeon' },
  },
  {
    title: 'LCD',
    name: 'Iván Barrera Hernández',
    role: { es: 'Atención dental', en: 'Dental care' },
    qualification: { es: 'Licenciado en Cirujano Dentista', en: 'Degree in dental surgery' },
    license: '5864972',
  },
  {
    name: 'Betzabe Vázquez Torres',
    role: { es: 'Recepción', en: 'Reception' },
    qualification: { es: 'Recepcionista', en: 'Receptionist' },
  },
  {
    name: 'Ana Ramos Castillo',
    role: { es: 'Apoyo del consultorio', en: 'Practice support' },
    qualification: { es: 'Asistente de limpieza', en: 'Cleaning assistant' },
  },
];
