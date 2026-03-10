interface Props {
  title: string;
  content?: string;
}

export default function JobRequirement({ title, content }: Props) {
  if (!content) return null;

  return (
    <div className="job-section">
      <h3>{title}</h3>
      <ul>
        {content.split("\n").map((item, index) => (
          <li key={index}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
