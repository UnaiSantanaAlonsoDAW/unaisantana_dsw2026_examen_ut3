import { randomUUID } from 'node:crypto';

interface Notice {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface NoticeChanges {
  title?: string;
  description?: string;
}

// Array en memoria para almacenar los documentos temporalmente
const notices: Notice[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Convocatoria de becas generales del Ministerio',
    description: 'El plazo de solicitud permanecerá abierto hasta el 30 de septiembre a través de la sede electrónica.',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: '22222222-2222-4111-8111-222222222222',
    title: 'Convocatoria de pruebas libres de idiomas',
    description: 'Inscripción disponible en la secretaría del centro en horario de 9:00 a 13:00.',
    createdAt: '2026-09-03T10:15:00.000Z',
  },
  {
    id: '33333333-3333-4111-8111-333333333333',
    title: 'Convocatoria de ayudas para transporte escolar',
    description: 'Documentación requerida disponible en el tablón de anuncios y en la web del instituto.',
    createdAt: '2026-09-05T11:30:00.000Z',
  },
  {
    id: '44444444-4444-4111-8111-444444444444',
    title: 'Calendario de presentaciones del nuevo curso',
    description: 'Consulta el aula y la hora asignada a cada grupo antes del lunes.',
    createdAt: '2026-09-07T09:00:00.000Z',
  },
  {
    id: '55555555-5555-4111-8111-555555555555',
    title: 'Apertura de matrícula para actividades del curso',
    description: 'Plazas limitadas por orden de entrega en conserjería.',
    createdAt: '2026-09-10T12:45:00.000Z',
  },
];

export function list(page: number, limit: number, search?: string) {
  const filtered = search
    ? notices.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
    : notices;

  const start = (page - 1) * limit;
  return {
    data: filtered.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
    },
  };
}

export function getById(id: string): Notice | undefined {
  return notices.find((d) => d.id === id);
}

export function create(title: string, description?: string): Notice {
  const newNotice: Notice = {
    id: randomUUID(),
    title,
    description: description ?? '',
    createdAt: new Date().toISOString(),
  };

  notices.push(newNotice);
  return newNotice;
}

export function update(id: string, changes: NoticeChanges): Notice | undefined {
  const document = getById(id);
  if (!document) {
    return undefined;
  }

  if (changes.title !== undefined) {
    document.title = changes.title;
  }

  if (changes.description !== undefined) {
    document.description = changes.description;
  }

  return document;
}