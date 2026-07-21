import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StudentMenu } from "../../components/student/StudentMenu";
import { getCourse } from "../../data/course";
import { chapterGroupLabel } from "../../constants/chapterGroups";
import type { Course } from "../../types/course";
import "./ChaptersPage.css";

export function GroupSelectPage() {
  const navigate = useNavigate();
  const { group } = useParams<{ group: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCourse()
      .then(setCourse)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !course) {
    return <div className="chapters-page">Loading...</div>;
  }

  const handleChapterClick = (chapterId: number) => {
    const chapter = course.chapters.find((ch) => ch.id === chapterId);

    if (chapter?.pages && chapter.pages.length > 0) {
      navigate(`/student/chapters/${chapterId}/flow`);
      return;
    }

    navigate(`/student/chapters/${chapterId}`);
  };

  const groupChapters = course.chapters
    .filter((chapter) => chapter.group === group)
    .sort((a, b) => a.orderNumber - b.orderNumber);
  const half = Math.ceil(groupChapters.length / 2);
  const columns = [groupChapters.slice(0, half), groupChapters.slice(half)];

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate("/student/plc")}>
            Home
          </button>
          <StudentMenu />
        </div>
      </header>

      <main className="chapters-main">
        <div className="chapters-logo">
          <img
            src="/assets/logo-plc.png"
            alt="Interactive Digital Learning - PLC Trainer"
            className="chapters-logo-image"
          />
        </div>

        {groupChapters.length === 0 ? (
          <p>No {chapterGroupLabel(group ?? "")} chapters yet.</p>
        ) : (
          <div className="chapters-grid">
            {columns.map((columnChapters, columnIndex) => (
              <div className="chapters-column" key={columnIndex}>
                {columnChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className="chapter-btn"
                    type="button"
                    onClick={() => handleChapterClick(chapter.id)}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
