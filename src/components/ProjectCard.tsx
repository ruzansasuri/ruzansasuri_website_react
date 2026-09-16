import { useState } from "react";

interface ProjectCardProps {
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
}

export default function ProjectCard({ slug, name, description, thumbnail, videoUrl }: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <a
      className="project-card"
      href={`/projects/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="project-card__media">
        <img className="project-card__thumb" src={thumbnail} alt="" loading="lazy" />
        {isHovering && videoUrl ? (
          <video className="project-card__video" src={videoUrl} autoPlay loop muted playsInline />
        ) : null}
      </div>
      <div className="project-card__body">
        <p className="project-card__title">{name}</p>
        <p className="project-card__desc">{description}</p>
      </div>
    </a>
  );
}
