/** Native pixel-grid SVG: keeps the pet sharp at any size and allows real ear/blink animation. */
export function WhiteRabbit({ celebrating = false }: { celebrating?: boolean }) {
  return <svg className={`white-rabbit ${celebrating ? 'white-rabbit--celebrate' : ''}`} viewBox="0 0 72 88" role="img" aria-label="A smiling white rabbit in a lilac waistcoat, holding a golden pocket watch" shapeRendering="crispEdges">
    <g className="rabbit-ear rabbit-ear--left">
      <path d="M19 28V9h3V3h7v3h3v23z" fill="#6d5375" />
      <path d="M22 27V10h2V6h4v4h2v18z" fill="#fffcf3" />
      <path d="M25 12h3v15h-3z" fill="#e9b7ca" />
    </g>
    <g className="rabbit-ear rabbit-ear--right">
      <path d="M40 29V6h3V1h7v3h3v19h-3v7z" fill="#6d5375" />
      <path d="M43 28V7h2V4h4v4h1v14h-3v7z" fill="#fffcf3" />
      <path d="M46 10h3v11h-3v6h-3V16h3z" fill="#e9b7ca" />
    </g>
    <path d="M20 76h-5v4h-3v5h18v-3h12v3h17v-7h-5v-5z" fill="#6d5375" />
    <path d="M17 78h12v4H15v-2h2zm26 0h11v2h2v2H43z" fill="#fffaf1" />
    <path d="M22 48h29v5h4v7h4v12h-4v6H19v-5h-5V61h3v-8h5z" fill="#6d5375" />
    <path d="M22 51h27v5h4v17h-4v3H23v-3h-5V60h4z" fill="#fff9ef" />
    <path d="M25 51h22v4h3v18H22V55h3z" fill="#a28bb5" />
    <path d="M25 51h7l4 7 4-7h7l-5 11h-5v11h-3V62h-4z" fill="#d3bfdc" />
    <path d="M34 63h2v2h-2zm0 6h2v2h-2z" fill="#fff0b9" />
    <path d="M15 29h5v-5h28v3h6v5h4v7h-2v7h-5v5H21v-3h-6v-4h-4V33h4z" fill="#6d5375" />
    <path d="M17 31h5v-4h24v3h6v5h3v8h-5v5H22v-3h-6v-3h-2v-7h3z" fill="#fffdf6" />
    <path d="M16 41h5v4h4v3h25v-3h5v-3h-4v3H24v-2h-8z" fill="#e3d7df" />
    <g className="rabbit-eyes" fill="#57425f"><path d="M25 34h3v6h-3zm18 0h3v6h-3z" /></g>
    <path d="M25 34h1v2h-1zm18 0h1v2h-1z" fill="#fff" />
    <path d="M19 40h6v3h-6zm27 0h6v3h-6z" fill="#f1c2d0" />
    <path d="M33 40h6v2h-2v2h-2v-2h-2z" fill="#bc7f99" />
    <path d="M32 44h3v2h-3zm5 0h3v2h-3z" fill="#876479" />
    <path d="M27 49h5v2h7v-2h5v7h-5v-2h-7v2h-5z" fill="#a85a79" />
    <path d="M33 51h5v3h-5z" fill="#d48ea5" />
    <path d="M16 57h6v13h-5v-3h-3v-7h2z" fill="#6d5375" />
    <path d="M17 59h4v8h-4z" fill="#fff9ef" />
    <g className="rabbit-watch">
      <path d="M51 51h7v3h-2v4h-3v-4h-2z" fill="#9b7039" />
      <path d="M49 57h11v3h4v14h-4v3H49v-3h-4V60h4z" fill="#8c653f" />
      <path d="M49 60h12v13H49v-3h-2v-7h2z" fill="#e5b75f" />
      <path d="M51 62h8v9h-8v-2h-2v-5h2z" fill="#fff4c9" />
      <path d="M54 63h2v4h3v2h-5z" fill="#8b6849" />
      <path d="M50 59h8v2h-8z" fill="#ffdc8b" />
    </g>
    <path d="M44 58h6v3h3v5h-3v2h-6v-2h-2v-5h2z" fill="#6d5375" />
    <path d="M45 60h4v3h2v2h-6z" fill="#fff9ef" />
  </svg>;
}
