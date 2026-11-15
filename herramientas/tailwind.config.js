/** Tokens tomados de la línea gráfica de Stitch ("Vibrant Pulse", modo oscuro). */
module.exports = {
  content: ['../public_html/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#E50914', hover: '#C90812', soft: '#FFB4AA' },
        base: '#0F1012',        // fondo de página
        layer1: '#18191C',      // tarjetas
        layer2: '#232428',      // tarjetas elevadas / inputs
        highlight: '#2E3035',
        line: '#383A40',        // bordes
        ink: '#F4F4F6',         // texto principal
        muted: '#A1A1AA',       // texto secundario
        ok: '#22C55E',
        warn: '#F59E0B',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { page: '1240px' },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
