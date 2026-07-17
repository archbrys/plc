import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentMenu } from "../../components/student/StudentMenu";
import { getCourse } from "../../data/course";
import { homeButtonApiService } from "../../services/homeButtonApiService";
import type { Course } from "../../types/course";
import "./ChaptersPage.css";

export function ChaptersPage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [linkedChapterIds, setLinkedChapterIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCourse(), homeButtonApiService.getHomeButtons()])
      .then(([courseData, homeButtons]) => {
        setCourse(courseData);
        setLinkedChapterIds(
          new Set(
            homeButtons
              .filter((button) => button.targetType === "CHAPTER" && button.chapterId !== null)
              .map((button) => button.chapterId as number),
          ),
        );
      })
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
            className="btn secondary small"
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
            const visibleChapters = course.chapters
              .filter((chapter) => !linkedChapterIds.has(chapter.id))
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((chapter, index) => ({ ...chapter, displayNumber: index + 1 }));
            const half = Math.ceil(visibleChapters.length / 2);
            const columns = [
              visibleChapters.slice(0, half),
              visibleChapters.slice(half),
            ];

            return columns.map((columnChapters, columnIndex) => (
              <div className="chapters-column" key={columnIndex}>
                {columnChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className="chapter-btn btn-sm"
                    type="button"
                    onClick={() => handleChapterClick(chapter.id)}
                  >
                    CHAPTER {chapter.displayNumber}
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
