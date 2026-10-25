// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Firebase Analytics (GA4). Firebase console → Project settings → Your apps → web app → measurementId.
// Empty = no analytics (local builds, previews).
const gaId = process.env.PUBLIC_GA_MEASUREMENT_ID;
const analytics = gaId
	? [
			{ tag: 'script', attrs: { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true } },
			{
				tag: 'script',
				content: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
			},
		]
	: [];

// https://astro.build/config
export default defineConfig({
	site: 'https://developers.kinesia.one',
	integrations: [
		starlight({
			title: 'Kinesia for Developers',
			description: 'Documentación de KinesiaMotion, el SDK de Kinesia para medir movimiento con la cámara, en iOS y Android.',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es' },
				en: { label: 'English', lang: 'en' },
				pt: { label: 'Português', lang: 'pt-BR' },
			},
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				alt: 'Kinesia',
			},
			favicon: '/favicon.png',
			head: analytics,
			customCss: ['./src/styles/kinesia.css'],
			social: [
				{ icon: 'github', label: 'GitHub (iOS)', href: 'https://github.com/elmaedesistemas/kinesia-motion-ios' },
				{ icon: 'github', label: 'GitHub (Android)', href: 'https://github.com/elmaedesistemas/kinesia-motion-android' },
			],
			editLink: {
				baseUrl: 'https://github.com/elmaedesistemas/kinesia-developers/edit/main/',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Empezar', translations: { en: 'Get started', 'pt-BR': 'Começar' },
					items: [
						{ label: 'Introducción', translations: { en: 'Introduction', 'pt-BR': 'Introdução' }, slug: 'empezar/introduccion' },
					],
				},
				{
					label: 'iOS',
					items: [
						{ label: 'Instalación', translations: { en: 'Installation', 'pt-BR': 'Instalação' }, slug: 'empezar/instalacion' },
						{ label: 'Inicio rápido', translations: { en: 'Quick start', 'pt-BR': 'Início rápido' }, slug: 'empezar/inicio-rapido' },
						{ label: 'Cámara en vivo con Vision', translations: { en: 'Live camera with Vision', 'pt-BR': 'Câmera ao vivo com Vision' }, slug: 'guias/camara-vision' },
					],
				},
				{
					label: 'Android',
					items: [
						{ label: 'Instalación', translations: { en: 'Installation', 'pt-BR': 'Instalação' }, slug: 'android/instalacion' },
						{ label: 'Inicio rápido', translations: { en: 'Quick start', 'pt-BR': 'Início rápido' }, slug: 'android/inicio-rapido' },
						{ label: 'Cámara con MediaPipe', translations: { en: 'Camera with MediaPipe', 'pt-BR': 'Câmera com MediaPipe' }, slug: 'android/camara-mediapipe' },
						{ label: 'Diferencias con iOS', translations: { en: 'Differences from iOS', 'pt-BR': 'Diferenças com o iOS' }, slug: 'android/diferencias-con-ios' },
					],
				},
				{
					label: 'Conceptos', translations: { en: 'Concepts', 'pt-BR': 'Conceitos' },
					items: [
						{ label: 'Cómo funciona', translations: { en: 'How it works', 'pt-BR': 'Como funciona' }, slug: 'conceptos/como-funciona' },
						{ label: 'El contrato de Pose', translations: { en: 'The Pose contract', 'pt-BR': 'O contrato de Pose' }, slug: 'conceptos/pose' },
						{ label: 'Repeticiones y sostenidos', translations: { en: 'Reps and holds', 'pt-BR': 'Repetições e sustentações' }, slug: 'conceptos/repeticiones' },
					],
				},
				{
					label: 'Guías', translations: { en: 'Guides', 'pt-BR': 'Guias' },
					items: [
						{ label: 'Eventos y snapshot', translations: { en: 'Events and snapshot', 'pt-BR': 'Eventos e snapshot' }, slug: 'guias/eventos-y-snapshot' },
						{ label: 'Medición inicial', translations: { en: 'Baseline measurement', 'pt-BR': 'Medição inicial' }, slug: 'guias/medicion-inicial' },
						{ label: 'Calidad de la medición', translations: { en: 'Measurement quality', 'pt-BR': 'Qualidade da medição' }, slug: 'guias/calidad-de-medicion' },
						{ label: 'Ejercicios personalizados', translations: { en: 'Custom exercises', 'pt-BR': 'Exercícios personalizados' }, slug: 'guias/ejercicios-personalizados' },
						{ label: 'Pruebas y grabaciones', translations: { en: 'Tests and recordings', 'pt-BR': 'Testes e gravações' }, slug: 'guias/pruebas-y-grabaciones' },
					],
				},
				{
					label: 'Referencia', translations: { en: 'Reference', 'pt-BR': 'Referência' },
					items: [
						{ label: 'Catálogo de ejercicios', translations: { en: 'Exercise catalog', 'pt-BR': 'Catálogo de exercícios' }, slug: 'referencia/ejercicios' },
						{ label: 'API (iOS)', items: [{ autogenerate: { directory: 'referencia/api' } }] },
						{ label: 'Versiones', translations: { en: 'Releases', 'pt-BR': 'Versões' }, slug: 'referencia/versiones' },
					],
				},
			],
		}),
	],
});
