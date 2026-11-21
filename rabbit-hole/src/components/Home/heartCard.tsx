const HeartCard = () => {
  return (
    <svg className="heart-card" viewBox="0 0 24 32" fill="none">
      <path d="M2 0h20v2h2v28h-2v2H2v-2H0V2h2z" fill="#905e77" />
      <path d="M2 2h20v28H2z" fill="#fff3dc" />
      <path d="M2 27h20v3H2z" fill="#f1d4cc" />
      <path
        d="M6 4h2v1h1v4H8V7H6v2H5V5h1zm0 1v1h2V5zm1 7h4v2h2v-2h4v2h2v4h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-4h2zm11 13h2v2h-2z"
        fill="#bb637f"
      />
      <path d="M7 14h2v2H7z" fill="#f9b4bd" />
    </svg>
  );
}

export default HeartCard;