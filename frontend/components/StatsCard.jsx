function StatsCard({ label, value, tone }) {
  return (
    <article className={`stats-card ${tone}`}>
      <span className="stats-label">{label}</span>
      <strong className="stats-value">{value}</strong>
    </article>
  );
}

export default StatsCard;
