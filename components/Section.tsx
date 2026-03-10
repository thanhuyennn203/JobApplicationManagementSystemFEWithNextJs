export function Section({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="job-section">
      <h3>{title}</h3>
      <ul>
        {content.split("\n").map((item, index) => (
          <li key={index}>{item.replace("-", "").trim()}</li>
        ))}
      </ul>
    </div>
  );
}
