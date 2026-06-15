/**
 * WorldRank — Mock Data Layer
 * Productos virales, herramientas IA y datos comerciales
 * v2.0
 */
(function() {
  'use strict';

  const DATA = {
    productosVirales: [
      {
        id: 'airfryer-cosori',
        name: 'Airfryer Cosori Pro 5.5L',
        category: 'Hogar',
        trendScore: 94,
        sourceSignals: ['TikTok', 'YouTube', 'Amazon Top 10'],
        reason: 'La airfryer más recomendada por influencers de cocina',
        price: '~109€',
        image: '🍟',
        description: 'Freidora de aire con 12 funciones,控制 digital y aplicación móvil. La más vendida en Amazon.',
        longDescription: 'La Cosori Pro 5.5L se ha convertido en la airfryer de referencia gracias a sus 12 funciones programables, control desde app y resultados de cocción uniformes. Con capacidad para 5-6 personas, es ideal para familias que buscan cocinar más sano sin renunciar al sabor.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B09JQRPJGS', type: 'comprar' },
          { platform: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-cosori-airfryer.html', type: 'ver oferta' }
        ],
        whereToBuy: 'Disponible en Amazon España, MediaMarkt y El Corte Inglés. En Amazon suele tener envío Prime.',
        alternatives: ['Airfryer Xiaomi Smart', 'Philips Essential Airfryer XL', 'Cecotec Cecofry Bombastik'],
        quickOpinion: 'Si buscas la mejor relación calidad-precio en airfryers, esta es. No lo dudes.',
        faqs: [
          { q: '¿Cuánto consume?', a: 'Aproximadamente 1500W, menos que un horno convencional.' },
          { q: '¿Se puede hacer pizza?', a: 'Sí, con el accesorio adecuado. Viene sin él pero se compra aparte.' }
        ],
        growthSignals: 'Búsquedas +180% interanual. #1 en cocina en TikTok España.'
      },
      {
        id: 'robot-aspirador-xiaomi',
        name: 'Xiaomi Robot Vacuum S20',
        category: 'Hogar',
        trendScore: 91,
        sourceSignals: ['TikTok', 'Amazon', 'Google Trends'],
        reason: 'La automatización del hogar sigue imparable y Xiaomi domina el segmento económico',
        price: '~199€',
        image: '🤖',
        description: 'Robot aspirador y fregasuelos con navegación LDS, 4000Pa de succión y control por app.',
        longDescription: 'El Xiaomi S20 combina aspirado y fregado con navegación láser precisa. Mapea tu casa en minutos, evita obstáculos y puedes programarlo desde la app. Con 4000Pa de succión, con pelos de mascotas sin problema.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B0CPYPMRL5', type: 'comprar' },
          { platform: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-xiaomi-robot-vacuum.html', type: 'ver oferta' }
        ],
        whereToBuy: 'Amazon España y AliExpress Official Store. En AliExpress suele estar 20-30€ más barato.',
        alternatives: ['Roborock Q5 Pro', 'Roomba i3+ EVO', 'Samsung Bespoke Jet Bot'],
        quickOpinion: 'El mejor robot calidad-precio del mercado. No necesitas gastar más.',
        faqs: [
          { q: '¿Fregona bien?', a: 'Para mantenimiento diario sí. Para manchas difíciles necesitas fregona manual.' },
          { q: '¿Funciona con alfombras?', a: 'Sí, detecta alfombras y aumenta la succión automáticamente.' }
        ],
        growthSignals: 'Ventas +65% en 2025. Categoría smart home creciendo +40% anual.'
      },
      {
        id: 'cargador-ugreen-gan',
        name: 'Cargador UGREEN 100W GaN',
        category: 'Electrónica',
        trendScore: 88,
        sourceSignals: ['YouTube', 'Reddit', 'Amazon'],
        reason: 'La tecnología GaN está reemplazando los cargadores tradicionales',
        price: '~45€',
        image: '🔌',
        description: 'Cargador USB-C GaN de 100W con 4 puertos, compatible con MacBook, iPhone, Samsung y más.',
        longDescription: 'Este cargador UGREEN usa tecnología Nitruro de Galio (GaN) para ofrecer 100W en un tamaño compacto. Carga un MacBook Pro al 50% en 30 minutos. Tiene 3 puertos USB-C y 1 USB-A, con detección inteligente de dispositivos.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B0B1P9PBK7', type: 'comprar' }
        ],
        whereToBuy: 'Amazon España. También en la tienda oficial de UGREEN.',
        alternatives: ['Anker Prime GaN 100W', 'Baseus GaN 100W', 'SlimQ GaN 100W'],
        quickOpinion: 'Esencial si tienes varios dispositivos USB-C. Pequeño, potente y fiable.',
        faqs: [
          { q: '¿Carga un MacBook Pro?', a: 'Sí, 100W es suficiente para cualquier MacBook Pro.' },
          { q: '¿Se calienta mucho?', a: 'La tecnología GaN genera menos calor que los cargadores tradicionales.' }
        ],
        growthSignals: 'GaN chargers +120% en búsquedas. Tendencia imparable.'
      },
      {
        id: 'auriculares-samsung-buds3',
        name: 'Samsung Galaxy Buds3 Pro',
        category: 'Electrónica',
        trendScore: 86,
        sourceSignals: ['YouTube', 'X/Twitter', 'Google Trends'],
        reason: 'Lanzamiento reciente con cancelación de ruido mejorada y diseño renovado',
        price: '~199€',
        image: '🎧',
        description: 'Auriculares True Wireless con cancelación de ruido adaptativa, sonido 360 y hasta 30h de batería.',
        longDescription: 'Los Buds3 Pro traen cancelación de ruido adaptativa de doble etapa, control por deslizamiento con sensor de fuerza, y sonido envolvente 360 con seguimiento de cabeza. Modo conversación activa automáticamente cuando hablas.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B0D1XY6T9P', type: 'comprar' }
        ],
        whereToBuy: 'Amazon España, Samsung.com y tiendas de electrónica.',
        alternatives: ['AirPods Pro 2', 'Sony WF-1000XM5', 'Nothing Ear (2)'],
        quickOpinion: 'Los mejores auriculares para usuarios Android. Punto.',
        faqs: [
          { q: '¿Son compatibles con iPhone?', a: 'Sí, pero pierdes funciones avanzadas como la ecualización por app.' },
          { q: '¿Son resistentes al agua?', a: 'IP57, aguantan lluvia y salpicaduras.' }
        ],
        growthSignals: 'Búsquedas +200% desde el lanzamiento. Review bomb en YouTube.'
      },
      {
        id: 'creadora-video-ia-rivers',
        name: 'Rivers AI — Creadora de Vídeo IA',
        category: 'Productividad',
        trendScore: 96,
        sourceSignals: ['TikTok', 'YouTube', 'X/Twitter', 'Product Hunt'],
        reason: 'La herramienta de generación de vídeo IA que está arrasando en creadores de contenido',
        price: 'Gratis / ~20€/mes Pro',
        image: '🎬',
        description: 'Genera vídeos ultrarealistas a partir de texto o imágenes. Resultados que parecen reales.',
        longDescription: 'Rivers AI está revolucionando la creación de vídeo con modelos de última generación. Genera clips de hasta 60 segundos con coherencia temporal impresionante, movimiento natural y calidad cinematográfica. Ideal para creadores de contenido, marketers y storytellers.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://rivers.ai', type: 'probar gratis' }
        ],
        whereToBuy: 'Directamente en rivers.ai. Plan gratuito disponible con marca de agua.',
        alternatives: ['Runway Gen-3', 'Pika Labs', 'Kaiber', 'HeyGen'],
        quickOpinion: 'El salto a vídeo realista que todos esperaban. Pruébalo gratis.',
        faqs: [
          { q: '¿Cuánto dura un vídeo?', a: 'Hasta 60 segundos en el plan Pro, 10 en el gratuito.' },
          { q: '¿Se puede usar para YouTube?', a: 'Sí, muchos creadores ya lo usan para B-roll y clips virales.' }
        ],
        growthSignals: 'Product Hunt #1 del mes. +500% en usuarios en 3 meses.'
      },
      {
        id: 'figma-presentaciones',
        name: 'Figma — Presentaciones IA',
        category: 'Diseño',
        trendScore: 89,
        sourceSignals: ['Reddit', 'YouTube', 'LinkedIn'],
        reason: 'La nueva función de presentaciones con IA está canibalizando a Canva y PowerPoint',
        price: 'Gratis / ~12€/mes Profesional',
        image: '🎨',
        description: 'Crea presentaciones profesionales con IA generativa en segundos. Exporta a PDF, PPTX o web.',
        longDescription: 'Figma ha añadido generación de presentaciones completa con IA: diseña diapositivas, sugiere contenido, genera iconos coherentes y mantiene tu marca personal. Integración directa con tu sistema de diseño.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://figma.com/presentations', type: 'probar gratis' }
        ],
        whereToBuy: 'Figma.com. Plan gratuito muy completo. Profesional por 12€/mes.',
        alternatives: ['Canva IA', 'Gamma.app', 'Beautiful.ai', 'Google Slides + Gemini'],
        quickOpinion: 'Si ya usas Figma, esto es el fin de PowerPoint. Si no, Canva sigue siendo más fácil.',
        faqs: [
          { q: '¿Es mejor que Canva?', a: 'Para diseño profesional sí. Para rapidez, Canva sigue ganando.' },
          { q: '¿Funciona offline?', a: 'No, Figma es 100% online.' }
        ],
        growthSignals: '+300% en adopción empresarial. Trending en LinkedIn.'
      }
    ],

    herramientasIA: [
      {
        id: 'chatgpt-pro',
        name: 'ChatGPT Pro',
        category: 'Escritura',
        trendScore: 98,
        sourceSignals: ['Google Trends', 'X/Twitter', 'YouTube', 'Reddit'],
        reason: 'Sigue siendo la herramienta IA más usada del mundo con nuevas funciones semanales',
        price: 'Gratis / ~20€/mes Plus / ~200€/mes Pro',
        image: '🤖',
        description: 'Asistente IA multimodal con voz, visión, generación de imágenes y análisis de datos.',
        longDescription: 'ChatGPT es el asistente IA más popular del mundo. Con GPT-4o, ofrece respuestas en tiempo real con voz natural, visión por cámara, análisis de archivos, generación de imágenes DALL-E y navegación web. La versión Pro desbloquea razonamiento avanzado con o1 y acceso prioritario.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://chatgpt.com', type: 'probar gratis' }
        ],
        whereToBuy: 'chatgpt.com. Plan gratuito disponible. Plus 20€/mes. Pro 200€/mes.',
        alternatives: ['Claude Pro', 'Gemini Advanced', 'Perplexity Pro', 'DeepSeek'],
        quickOpinion: 'El todoterreno de la IA. Si solo puedes pagar una suscripción, que sea esta.',
        faqs: [
          { q: '¿Qué diferencia hay entre Plus y Pro?', a: 'Pro tiene acceso ilimitado a o1, voz en tiempo real y DALL-E sin límites.' },
          { q: '¿La versión gratuita es útil?', a: 'Sí, GPT-4o-mini es muy capaz para el día a día.' }
        ],
        growthSignals: '+50 millones de usuarios semanales. Dominio absoluto del mercado.'
      },
      {
        id: 'claude-pro',
        name: 'Claude Pro (Anthropic)',
        category: 'Escritura',
        trendScore: 92,
        sourceSignals: ['Reddit', 'X/Twitter', 'YouTube', 'LinkedIn'],
        reason: 'Referente en razonamiento profundo y desarrollo de software con Claude Sonnet 4',
        price: 'Gratis / ~18€/mes Pro / ~200€/mes Max',
        image: '🧠',
        description: 'IA con énfasis en seguridad, pensamiento profundo y código. Perfecta para desarrolladores.',
        longDescription: 'Claude de Anthropic destaca por su capacidad de razonamiento, manejo de contextos largos (200k tokens) y generación de código excepcional. Claude Sonnet 4 compite cabeza a cabeza con GPT-4o en programación. Su tono es más reflexivo y cuidadoso.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://claude.ai', type: 'probar gratis' }
        ],
        whereToBuy: 'claude.ai. Plan gratuito limitado. Pro 18€/mes.',
        alternatives: ['ChatGPT Pro', 'Gemini Advanced', 'Cursor Pro', 'DeepSeek Chat'],
        quickOpinion: 'La mejor IA para programar y tareas que requieren pensamiento profundo.',
        faqs: [
          { q: '¿Es mejor que ChatGPT para programar?', a: 'Muchos desarrolladores dicen que sí, especialmente con Claude Sonnet 4.' },
          { q: '¿Tiene modo voz?', a: 'Sí, desde 2025.' }
        ],
        growthSignals: 'Adopción +200% en empresas tech. #1 en satisfacción según encuestas.'
      },
      {
        id: 'cursor-ide',
        name: 'Cursor — IDE con IA',
        category: 'Código',
        trendScore: 95,
        sourceSignals: ['YouTube', 'Reddit', 'X/Twitter', 'GitHub'],
        reason: 'El editor de código IA que está reemplazando VS Code entre desarrolladores',
        price: 'Gratis / ~20€/mes Pro',
        image: '💻',
        description: 'Editor de código basado en VS Code con IA integrada que escribe, explica y refactoriza código.',
        longDescription: 'Cursor es un fork de VS Code con IA integrada a nivel nativo. Escribe código desde prompts, autocompleta en tiempo real con comprensión del contexto, refactoriza archivos enteros y entiende tu base de código completa. Imprescindible para desarrollo moderno.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://cursor.com', type: 'probar gratis' }
        ],
        whereToBuy: 'cursor.com. Plan gratuito con límite de 2000 solicitudes/mes.',
        alternatives: ['VS Code + Copilot', 'Windsurf', 'Zed AI', 'JetBrains AI'],
        quickOpinion: 'VS Code + Copilot está bien, pero Cursor es otro nivel. Game changer.',
        faqs: [
          { q: '¿Migrar de VS Code es fácil?', a: 'Sí, importa todas tus extensiones y configuraciones automáticamente.' },
          { q: '¿Funciona con cualquier lenguaje?', a: 'Sí, hereda el ecosistema de extensiones de VS Code.' }
        ],
        growthSignals: 'Valoración +$400M. Comunidad +1M desarrolladores.'
      },
      {
        id: 'minimax-video',
        name: 'MiniMax — Video IA',
        category: 'Video',
        trendScore: 87,
        sourceSignals: ['TikTok', 'YouTube', 'X/Twitter'],
        reason: 'La generación de vídeo china que está sorprendiendo por su realismo',
        price: 'Gratis / Desde ~10€/mes',
        image: '🎥',
        description: 'Generación de vídeo HD ultrarealista. Crea clips cinematográficos desde texto en segundos.',
        longDescription: 'MiniMax (Hailuo AI) genera vídeos de alta definición con una calidad que compite con Sora de OpenAI. Movimientos fluidos, iluminación realista y coherencia temporal. Ideal para marketers, creadores y producción audiovisual independiente.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://hailuoai.com', type: 'probar gratis' }
        ],
        whereToBuy: 'hailuoai.com. Plan gratuito con créditos diarios.',
        alternatives: ['Sora (OpenAI)', 'Runway Gen-3', 'Pika 2.0', 'Kling'],
        quickOpinion: 'La mejor calidad-precio en vídeo IA ahora mismo. Sora es mejor pero más caro.',
        faqs: [
          { q: '¿Cuánto dura cada vídeo?', a: 'Hasta 10 segundos en plan gratuito, 30 en Pro.' },
          { q: '¿Tiene derechos de uso comercial?', a: 'Sí, los vídeos generados son tuyos.' }
        ],
        growthSignals: '+1M usuarios en 2 meses. Temido competidor de Sora.'
      },
      {
        id: 'notion-ai',
        name: 'Notion IA',
        category: 'Productividad',
        trendScore: 85,
        sourceSignals: ['LinkedIn', 'YouTube', 'Reddit'],
        reason: 'La herramienta de productividad con IA que está transformando equipos enteros',
        price: 'Gratis / ~10€/mes IA add-on',
        image: '📝',
        description: 'Notas, wikis, proyectos y base de datos con IA integrada que escribe, resume y organiza.',
        longDescription: 'Notion con IA no solo organiza tu conocimiento: escribe borradores, resume reuniones, genera ideas de proyectos, traduce contenido y reescribe textos con tu tono. Integra calendario, bases de datos relacionales y más de 100 plantillas.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://notion.so', type: 'probar gratis' }
        ],
        whereToBuy: 'notion.so. Plan gratuito completo. IA add-on 10€/mes.',
        alternatives: ['Obsidian + Copilot', 'Coda IA', 'ClickUp IA', 'Mem.ai'],
        quickOpinion: 'Si tu equipo vive en Notion, la IA multiplica tu productividad por 3.',
        faqs: [
          { q: '¿Es seguro para datos empresariales?', a: 'Sí, Notion cumple con SOC 2 y GDPR.' },
          { q: '¿Funciona offline?', a: 'Solo lectura offline. Las funciones IA requieren conexión.' }
        ],
        growthSignals: '+100M usuarios. IA add-on adoptado por +2M equipos.'
      },
      {
        id: 'elevenlabs-voice',
        name: 'ElevenLabs — Clonación de Voz',
        category: 'Audio',
        trendScore: 90,
        sourceSignals: ['YouTube', 'TikTok', 'Reddit', 'Product Hunt'],
        reason: 'Líder indiscutible en clonación de voz IA con calidad hiperrealista',
        price: 'Gratis / ~5€/mes Starter / ~22€/mes Creator',
        image: '🎙️',
        description: 'Clonación de voz, narración y doblaje IA con emociones y entonación natural.',
        longDescription: 'ElevenLabs domina la síntesis de voz con calidad imposible de distinguir de una humana. Ofrece clonación de voz con 1 minuto de muestra, biblioteca de voces, generación de audiolibros, doblaje automático manteniendo la voz original, y efectos de sonido IA.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://elevenlabs.io', type: 'probar gratis' }
        ],
        whereToBuy: 'elevenlabs.io. Plan gratuito con 10.000 caracteres/mes.',
        alternatives: ['Play.ht', 'Murf AI', 'Respeecher', 'Speechify'],
        quickOpinion: 'Si necesitas voces IA realistas, no hay competencia. Fin de la historia.',
        faqs: [
          { q: '¿Se puede clonar cualquier voz?', a: 'Sí, con una muestra limpia de 1 minuto.' },
          { q: '¿Es legal clonar voces?', a: 'Requieres permiso del titular de la voz.' }
        ],
        growthSignals: 'Valoración unicornio ($1.1B). Usado por +70% de creadores de audiolibros.'
      }
    ],

    appsPopulares: [
      {
        id: 'capcut',
        name: 'CapCut',
        category: 'Edición de vídeo',
        trendScore: 97,
        sourceSignals: ['TikTok', 'YouTube', 'App Store'],
        reason: 'La app de edición de vídeo de TikTok es la más descargada del mundo',
        price: 'Gratis / ~10€/mes Pro',
        image: '✂️',
        description: 'Editor de vídeo todo-en-uno con templates virales, IA y efectos profesionales.',
        longDescription: 'CapCut es el editor oficial de ByteDance (TikTok). Ofrece plantillas virales, eliminación de fondo con IA, generación automática de subtítulos, transiciones profesionales y exportación directa a TikTok. La versión Pro desbloquea más recursos y exportación 4K.',
        affiliateLinks: [
          { platform: 'App Store', url: 'https://apps.apple.com/app/capcut/id1500855883', type: 'descargar' },
          { platform: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.lemon.lvoverseas', type: 'descargar' }
        ],
        whereToBuy: 'iOS, Android y Web (capcut.com). Gratuito en todos.',
        alternatives: ['DaVinci Resolve', 'InShot', 'VN Editor', 'Premiere Rush'],
        quickOpinion: 'La puerta de entrada a la creación de contenido viral. Imprescindible.',
        faqs: [
          { q: '¿Es mejor que InShot?', a: 'Sí, sobre todo por los templates virales y la IA integrada.' },
          { q: '¿La versión gratuita tiene marca de agua?', a: 'No, CapCut es gratuito sin marca de agua.' }
        ],
        growthSignals: '+500M descargas. #1 en edición de vídeo móvil.'
      },
      {
        id: 'behance',
        name: 'Behance',
        category: 'Diseño',
        trendScore: 78,
        sourceSignals: ['Google Trends', 'LinkedIn', 'Reddit'],
        reason: 'La red social de diseñadores con portafolios que marcan tendencias visuales',
        price: 'Gratis',
        image: '🎯',
        description: 'Plataforma de portafolios creativos. Descubre tendencias de diseño gráfico, UX e ilustración.',
        longDescription: 'Behance de Adobe es donde los diseñadores publican sus mejores trabajos. Es la fuente #1 para ver tendencias visuales antes de que lleguen al mainstream: paletas de color, tipografía, UI/UX, motion graphics e ilustración.',
        affiliateLinks: [
          { platform: 'Web oficial', url: 'https://behance.net', type: 'explorar' }
        ],
        whereToBuy: 'behance.net. Gratuito. Requiere cuenta Adobe.',
        alternatives: ['Dribbble', 'ArtStation', 'Pinterest', 'DeviantArt'],
        quickOpinion: 'La mejor fuente de inspiración de diseño del mundo. Gratis y sin límites.',
        faqs: [
          { q: '¿Se puede contactar a los diseñadores?', a: 'Sí, tienen perfil con enlaces a portfolios y contacto.' },
          { q: '¿Adobe cobra por Behance?', a: 'No, es gratuito incluso sin suscripción Adobe.' }
        ],
        growthSignals: '+50M usuarios activos. Referente de tendencias visuales.'
      }
    ],

    tecnologia: [
      {
        id: 'raspberry-pi-5',
        name: 'Raspberry Pi 5',
        category: 'Electrónica',
        trendScore: 92,
        sourceSignals: ['YouTube', 'Reddit', 'Google Trends'],
        reason: 'El miniordenador que está impulsando proyectos DIY, servidores domésticos y automatización',
        price: '~80€ (8GB RAM)',
        image: '🖥️',
        description: 'Ordenador de placa única con CPU ARM de 2.4GHz, GPU VideoCore VII y soporte para dual 4K.',
        longDescription: 'La Raspberry Pi 5 es un 2-3x más rápida que la Pi 4. Ideal para servidor doméstico, centro multimedia, NAS, emulación retro, proyectos IoT o como PC básico. Consume apenas 7W.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B0CTBG4LY4', type: 'comprar' },
          { platform: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-raspberry-pi-5.html', type: 'ver oferta' }
        ],
        whereToBuy: 'Amazon España, tiendas de electrónica. Escasez periódica, mejor reservar.',
        alternatives: ['Orange Pi 5', 'Banana Pi M7', 'ODROID N2L', 'Intel N100 Mini PC'],
        quickOpinion: 'El mejor ordenador por 80€ que puedes comprar. Punto.',
        faqs: [
          { q: '¿Sirve como PC de escritorio?', a: 'Sí, para navegación, ofimática y programación va sobrada.' },
          { q: '¿Necesito disipador?', a: 'Sí, se calienta más que la Pi 4. El Active Cooler es recomendable.' }
        ],
        growthSignals: '5 millones de unidades vendidas en 2024. Comunidad +3M de makers.'
      }
    ],

    belleza: [
      {
        id: 'cepillo-eshine',
        name: 'Cepillo Alisador E-Shine',
        category: 'Cuidado personal',
        trendScore: 86,
        sourceSignals: ['TikTok', 'Instagram', 'Amazon'],
        reason: 'Viral en TikTok por alisar el pelo en segundos sin dañarlo',
        price: '~35€',
        image: '💇‍♀️',
        description: 'Cepillo térmico que alisa, da volumen y brillo sin tirones. Tecnología iónica.',
        longDescription: 'El cepillo alisador E-Shine usa iones negativos para eliminar el encrespamiento mientras alisa. Se calienta en 30 segundos y distribuye el calor de forma uniforme. Resultado: pelo liso, brillante y sin daños por calor excesivo.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B0C8QZ9YHK', type: 'comprar' }
        ],
        whereToBuy: 'Amazon España. También en primark y Sephora online.',
        alternatives: ['Revlon One-Step', 'Dyson Airwrap (caro)', 'Lena Brush Iron'],
        quickOpinion: 'El invento más viral de belleza del año. Menos daño que una plancha tradicional.',
        faqs: [
          { q: '¿Funciona en pelo rizado?', a: 'Sí, pero necesitas pasarlo varias veces. Mejor con pelo semi-seco.' },
          { q: '¿Temperatura máxima?', a: '200°C, regulable en 3 niveles.' }
        ],
        growthSignals: '+500M visualizaciones en TikTok. #1 en ventas de cuidado capilar.'
      }
    ],

    videojuegos: [
      {
        id: 'steam-deck-oled',
        name: 'Steam Deck OLED',
        category: 'Hardware',
        trendScore: 93,
        sourceSignals: ['Reddit', 'YouTube', 'X/Twitter', 'Google Trends'],
        reason: 'La consola portátil PC que redefine el gaming portátil con pantalla OLED',
        price: '~569€ (512GB OLED)',
        image: '🎮',
        description: 'Consola portátil para juegos de PC con pantalla OLED HDR, batería mejorada y rendimiento superior.',
        longDescription: 'La Steam Deck OLED mejora la original con pantalla HDR OLED de 7.4", batería de 3-8 horas, procesador de 6nm más eficiente y WiFi 6E. Ejecuta toda tu biblioteca de Steam, emuladores, y hasta puede funcionar como PC de escritorio.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/B0D1D8WBZQ', type: 'comprar' },
          { platform: 'Steam Store', url: 'https://store.steampowered.com/steamdeck', type: 'oficial' }
        ],
        whereToBuy: 'Directamente en Steam. También Amazon y tiendas autorizadas.',
        alternatives: ['ASUS ROG Ally X', 'Nintendo Switch OLED', 'MSI Claw', 'Lenovo Legion Go'],
        quickOpinion: 'La mejor consola portátil para jugar tu biblioteca de PC. La OLED merece cada euro.',
        faqs: [
          { q: '¿Cuántos juegos de Steam funcionan?', a: 'Más de 15,000 juegos verificados o jugables.' },
          { q: '¿Se puede conectar a un monitor?', a: 'Sí, por USB-C a HDMI. Soporta 4K 60fps.' }
        ],
        growthSignals: 'Lista de espera agotada. +4M de unidades vendidas acumuladas.'
      }
    ],

    libros: [
      {
        id: 'supercomunicadores',
        name: 'Supercomunicadores — Charles Duhigg',
        category: 'Desarrollo personal',
        trendScore: 84,
        sourceSignals: ['YouTube', 'LinkedIn', 'Amazon', 'Goodreads'],
        reason: 'Libro #1 en comunicación que explica cómo conectar con cualquier persona',
        price: '~18€ (tapa blanda) / ~10€ (Kindle)',
        image: '📖',
        description: 'El libro que desvela los secretos de los mejores comunicadores del mundo.',
        longDescription: 'Charles Duhigg (autor de "El poder de los hábitos") analiza por qué algunas personas conectan al instante mientras otras luchan por hacerse entender. Basado en neurociencia y casos reales, ofrece técnicas prácticas para mejorar tu comunicación.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/8449342596', type: 'comprar' },
          { platform: 'Casa del Libro', url: 'https://www.casadellibro.com/libro-supercomunicadores/9788449342596', type: 'comprar' }
        ],
        whereToBuy: 'Amazon, Casa del Libro, Fnac, El Corte Inglés.',
        alternatives: ['Cómo ganar amigos e influir sobre las personas', 'Habla como TED', 'El arte de escuchar'],
        quickOpinion: 'El libro de comunicación más importante desde Carnegie. Léelo ya.',
        faqs: [
          { q: '¿Tiene ejercicios prácticos?', a: 'Sí, cada capítulo termina con técnicas aplicables.' },
          { q: '¿Está traducido al español?', a: 'Sí, "Supercomunicadores" en todas las librerías.' }
        ],
        growthSignals: '#1 en Amazon comunicación. +200K reseñas en Goodreads.'
      },
      {
        id: 'el-metodo-lean-startup',
        name: 'El Método Lean Startup — Eric Ries',
        category: 'Negocios',
        trendScore: 82,
        sourceSignals: ['LinkedIn', 'YouTube', 'Amazon'],
        reason: 'El manual de referencia para emprender con metodología ágil sigue vigente',
        price: '~16€ (tapa blanda) / ~9€ (Kindle)',
        image: '📊',
        description: 'Cómo crear startups exitosas usando el ciclo construir-medir-aprender.',
        longDescription: 'Eric Ries revolucionó el emprendimiento con el enfoque Lean: lanza rápido, mide resultados, aprende y repite. Este libro es la biblia del emprendimiento moderno, usado en Stanford, Harvard y Y Combinator.',
        affiliateLinks: [
          { platform: 'Amazon', url: 'https://www.amazon.es/dp/842340912X', type: 'comprar' },
          { platform: 'Casa del Libro', url: 'https://www.casadellibro.com/libro-el-metodo-lean-startup/978842340912X', type: 'comprar' }
        ],
        whereToBuy: 'Amazon, todas las librerías principales.',
        alternatives: ['De cero a uno (Peter Thiel)', 'El dilema del innovador', 'Hooked'],
        quickOpinion: 'Si vas a emprender, léelo antes de escribir una línea de código o gastar un euro.',
        faqs: [
          { q: '¿Es solo para startups tech?', a: 'No, los principios aplican a cualquier negocio.' },
          { q: '¿Sigue vigente después de 10 años?', a: 'Más que nunca. Los principios son atemporales.' }
        ],
        growthSignals: '+1M ejemplares vendidos. Lectura obligatoria en Y Combinator.'
      }
    ],

    ideasNegocio: [
      {
        id: 'agencia-video-ia',
        name: 'Agencia de Vídeo con IA',
        category: 'Contenido',
        trendScore: 94,
        sourceSignals: ['TikTok', 'YouTube', 'LinkedIn', 'Google Trends'],
        reason: 'La demanda de vídeo contenido supera la capacidad humana. IA cierra el gap.',
        price: 'Inversión inicial: ~500€',
        image: '🎬',
        description: 'Crea una agencia que produce vídeos para marcas usando herramientas IA (MiniMax, Rivers, HeyGen).',
        longDescription: 'Las marcas necesitan vídeo constante para redes sociales pero no pueden pagar producciones caras. Usando herramientas como Rivers AI, MiniMax y HeyGen, puedes producir vídeos de calidad profesional a una fracción del coste. Modelo de suscripción mensual: 500-2000€/cliente.',
        affiliateLinks: [
          { platform: 'Herramientas recomendadas', url: 'https://worldrank-eta.vercel.app/world-ranking/herramientas-ia', type: 'ver guía' }
        ],
        whereToBuy: 'Suscripciones a las herramientas IA (rivers.ai, minimax, elevenlabs).',
        alternatives: ['Producción tradicional de vídeo', 'Freelancers en Fiverr', 'Plantillas de Canva'],
        quickOpinion: 'El negocio con mayor potencial 2025-2026. Barrera de entrada casi cero.',
        faqs: [
          { q: '¿Qué habilidades necesito?', a: 'Saber usar prompts de IA y edición básica. Aprendible en 2 semanas.' },
          { q: '¿Cuánto puedo cobrar?', a: '500-2000€/mes por cliente. Con 5 clientes vives de ello.' }
        ],
        growthSignals: 'Mercado de vídeo IA: $1.5B en 2025, proyectado $10B en 2028.'
      },
      {
        id: 'newsletter-nichos',
        name: 'Newsletter de Nicho Curada con IA',
        category: 'Contenido',
        trendScore: 88,
        sourceSignals: ['LinkedIn', 'X/Twitter', 'Substack'],
        reason: 'Las newsletters temáticas con análisis profundo crecen mientras los medios generales declinan',
        price: 'Inversión inicial: ~200€',
        image: '📬',
        description: 'Crea una newsletter premium sobre un nicho específico usando IA para investigación y redacción.',
        longDescription: 'El auge de Substack y Beehiiv demuestra que la gente paga por contenido curado de calidad. Elige un nicho (ej: IA para abogados, tendencias de ecommerce, biotech) y usa IA para investigar, sintetizar y redactar análisis profundos. Modelo freemium: contenido gratis + premium 10-20€/mes.',
        affiliateLinks: [
          { platform: 'Herramientas recomendadas', url: 'https://worldrank-eta.vercel.app/world-ranking/herramientas-ia', type: 'ver guía' }
        ],
        whereToBuy: 'Substack, Beehiiv, Ghost. Gratis para empezar.',
        alternatives: ['Blog tradicional', 'Canal de YouTube', 'Podcast', 'Canal de Telegram'],
        quickOpinion: 'El mejor negocio para construir audiencia y monetizar conocimiento.',
        faqs: [
          { q: '¿Cuántos suscriptores necesito para vivir de ello?', a: 'Con 500 suscriptores de pago (10€/mes) = 5000€/mes.' },
          { q: '¿Qué nichos funcionan mejor?', a: 'B2B: IA, SaaS, marketing. B2C: inversión, fitness, productividad.' }
        ],
        growthSignals: '+50% crecimiento anual en suscripciones de pago. Mercado de $2B.'
      }
    ]
  };

  // Helper functions
  function getItemById(id) {
    for (const category in DATA) {
      if (Array.isArray(DATA[category])) {
        const found = DATA[category].find(item => item.id === id);
        if (found) return found;
      }
    }
    return null;
  }

  function getItemsByCategory(categoryName) {
    const results = [];
    for (const category in DATA) {
      if (Array.isArray(DATA[category])) {
        DATA[category].forEach(item => {
          if (item.category === categoryName) results.push(item);
        });
      }
    }
    return results;
  }

  function getTrendingItems(limit = 6) {
    const all = [];
    for (const category in DATA) {
      if (Array.isArray(DATA[category])) {
        DATA[category].forEach(item => all.push(item));
      }
    }
    return all.sort((a, b) => b.trendScore - a.trendScore).slice(0, limit);
  }

  // Export
  window.WORLDRANK_DATA = DATA;
  window.WORLDRANK_UTILS = {
    getItemById: getItemById,
    getItemsByCategory: getItemsByCategory,
    getTrendingItems: getTrendingItems
  };
})();
