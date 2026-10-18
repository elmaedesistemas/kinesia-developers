// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Kinesia for Developers',
			description: 'Documentación de KinesiaMotion, el SDK de Kinesia para medir movimiento con la cámara del iPhone.',
			defaultLocale: 'root',
			locales: { root: { label: 'Español', lang: 'es' } },
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				alt: 'Kinesia',
			},
			favicon: '/favicon.png',
			customCss: ['./src/styles/kinesia.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/elmaedesistemas/kinesia-motion' },
			],
			editLink: {
				baseUrl: 'https://github.com/elmaedesistemas/kinesia-developers/edit/main/',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Empezar',
					items: [
						{ label: 'Introducción', slug: 'empezar/introduccion' },
						{ label: 'Instalación', slug: 'empezar/instalacion' },
						{ label: 'Inicio rápido', slug: 'empezar/inicio-rapido' },
					],
				},
				{
					label: 'Conceptos',
					items: [
						{ label: 'Cómo funciona', slug: 'conceptos/como-funciona' },
						{ label: 'El contrato de Pose', slug: 'conceptos/pose' },
						{ label: 'Repeticiones y sostenidos', slug: 'conceptos/repeticiones' },
					],
				},
				{
					label: 'Guías',
					items: [
						{ label: 'Cámara en vivo con Vision', slug: 'guias/camara-vision' },
						{ label: 'Eventos y snapshot', slug: 'guias/eventos-y-snapshot' },
						{ label: 'Medición inicial', slug: 'guias/medicion-inicial' },
						{ label: 'Calidad de la medición', slug: 'guias/calidad-de-medicion' },
						{ label: 'Ejercicios personalizados', slug: 'guias/ejercicios-personalizados' },
						{ label: 'Pruebas y grabaciones', slug: 'guias/pruebas-y-grabaciones' },
					],
				},
				{
					label: 'Referencia',
					items: [
						{ label: 'Catálogo de ejercicios', slug: 'referencia/ejercicios' },
						{ label: 'API', items: [{ autogenerate: { directory: 'referencia/api' } }] },
						{ label: 'Versiones', slug: 'referencia/versiones' },
					],
				},
			],
		}),
	],
});
