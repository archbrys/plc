import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentMenu } from "../../components/student/StudentMenu";
import { getCourse } from "../../data/course";
import type { Course } from "../../types/course";
import "./ChaptersPage.css";

export function ChaptersPage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCourse()
      .then(setCourse)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !course) {
    return <div className="chapters-page">Loading course...</div>;
  }

  const handleChapterClick = (chapterId: number) => {
    const chapter = course.chapters.find((ch) => ch.id === chapterId);

    // Use dynamic flow if chapter has pages array
    if (chapter?.pages && chapter.pages.length > 0) {
      navigate(`/student/chapters/${chapterId}/flow`);
      return;
    }

    // Otherwise use simple chapter view
    navigate(`/student/chapters/${chapterId}`);
  };

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-actions">
          <button
            className="btn secondary"
            type="button"
            onClick={() => navigate("/student/plc-chapter-select")}
          >
            Back
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

        <div className="chapters-grid">
          {(() => {
            const sortedChapters = [...course.chapters].sort(
              (a, b) => a.orderNumber - b.orderNumber,
            );
            const half = Math.ceil(sortedChapters.length / 2);
            const columns = [
              sortedChapters.slice(0, half),
              sortedChapters.slice(half),
            ];

            return columns.map((columnChapters, columnIndex) => (
              <div className="chapters-column" key={columnIndex}>
                {columnChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className="chapter-btn"
                    type="button"
                    onClick={() => handleChapterClick(chapter.id)}
                  >
                    CHAPTER {chapter.orderNumber}
                  </button>
                ))}
              </div>
            ));
          })()}
        </div>
      </main>
    </div>
  );
}
