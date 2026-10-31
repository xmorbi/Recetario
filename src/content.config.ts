import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const recetas = defineCollection({
  // El "loader" le dice a Astro que busque todos los archivos .json en la carpeta
  loader: glob({ pattern: '**/*.json', base: './src/content/recetas' }),
  schema: z.object({
    titulo: z.string(),
    categoria: z.string(),
    tags: z.array(z.string()).optional(),
    imagen: z.string().nullable().optional(),
    tiempo: z.string().optional(),
    porciones: z.string().optional(),
    dificultad: z.string().optional(),
    tecnica: z.string().optional(),
    ingredientes: z.array(z.string()),
    pasos: z.array(z.string()),
    dato: z.string().nullable().optional(),
    
    // MAGIA: Si "errores" es un string, lo convierte en un array válido
    errores: z.preprocess((val) => {
      if (typeof val === 'string') return [{ error: val, solucion: 'Ninguna.' }];
      return val;
    }, z.array(
      z.object({
        error: z.string(),
        solucion: z.string()
      })
    ).optional()),
    
    // MAGIA: Si "conservacion" es un string, lo convierte en un objeto válido
    conservacion: z.preprocess((val) => {
      if (typeof val === 'string') return { refrigerador: val };
      return val;
    }, z.object({
      refrigerador: z.string().optional(),
      congelador: z.string().optional(),
      recalentar: z.string().optional()
    }).optional()),
  }),
});

export const collections = { recetas };