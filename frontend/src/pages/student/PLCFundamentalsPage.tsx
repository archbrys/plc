import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { StudentMenu } from "../../components/student/StudentMenu";
import { questionSetService } from "../../services/questionSetService";
import { resultService } from "../../services/resultService";
import type { QuestionSet, QuizResult, StudentAnswer } from "../../types/quiz";

const PLC_FUNDAMENTALS_TITLE = "PLC Fundamentals";

export function PLCFundamentalsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [previousResult, setPreviousResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [retaking, setRetaking] = useState(false);

  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "student") {
      return;
    }

    Promise.all([
      questionSetService.listPublished(),
      resultService.listByStudent(user.id),
    ]).then(([sets, results]) => {
      const set = sets.find(
        (s) =>
          s.title.trim().toLowerCase() === PLC_FUNDAMENTALS_TITLE.toLowerCase(),
      );
      if (!set) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setQuestionSet(set);

      const forThisSet = results
        .filter((result) => result.questionSetId === set.id)
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        );
      setPreviousResult(forThisSet[0] ?? null);
      setLoading(false);
    });
  }, [user]);

  const orderedQuestions = useMemo(
    () =>
      [...(questionSet?.questions ?? [])].sort(
        (a, b) => a.orderNumber - b.orderNumber,
      ),
    [questionSet?.questions],
  );

  const totalQuestions = orderedQuestions.length;
  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const progressPercentage =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  const isQuestionAnswered = (
    answer: StudentAnswer | undefined,
    question: QuestionSet["questions"][number],
  ) => {
    if (!answer) {
      return false;
    }
    switch (question.questionType) {
      case "multiple_choice":
        return Boolean(answer.selectedChoiceId);
      case "true_false":
        return typeof answer.selectedBoolean === "boolean";
      case "short_answer":
        return Boolean(answer.answerText?.trim());
      default:
        return false;
    }
  };

  const isCurrentQuestionAnswered = currentQuestion
    ? isQuestionAnswered(answers[currentQuestion.id], currentQuestion)
    : false;

  const updateAnswer = (questionId: string, patch: Partial<StudentAnswer>) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...current[questionId],
        ...patch,
        questionId,
      },
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!questionSet) return;
    setError("");

    if (!user || user.role !== "student") {
      setError("Student session not found.");
      return;
    }

    setSubmitting(true);
    const response = await resultService.submit(
      questionSet.id,
      user.id,
      Object.values(answers),
    );
    setSubmitting(false);

    if (!response.ok || !response.result) {
      setError((response.errors ?? ["Unable to submit quiz."]).join(" "));
      return;
    }

    sessionStorage.setItem("quiz_last_result_id", response.result.id);
    navigate("/student/completion");
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setError("");
    setRetaking(true);
  };

  const handleProceed = () => {
    navigate("/student/characters");
  };

  if (loading) {
    return (
      <div className="landing-page">
        <main className="plc-intro-content">
          <p className="muted">Loading...</p>
        </main>
      </div>
    );
  }

  if (notFound || !questionSet) {
    return (
      <div className="landing-page">
        <main className="plc-intro-content">
          <p className="muted">PLC Fundamentals is not available right now.</p>
        </main>
      </div>
    );
  }

  // Already answered and not retaking: show results summary with proceed/retake choice.
  if (previousResult && !retaking) {
    const percentage =
      previousResult.totalPoints > 0
        ? Math.round(
            (previousResult.earnedPoints / previousResult.totalPoints) * 100,
          )
        : 0;

    return (
      <div className="landing-page">
        <header className="landing-header">
          <div className="header-actions">
            <button
              className="btn secondary small"
              type="button"
              onClick={() => navigate("/student/plc")}
            >
              Back
            </button>
            <StudentMenu />
          </div>
        </header>

        <main className="completion-content">
          <div className="completion-container">
            <h1 className="completion-title">
              PLC Fundamentals — Already Completed
            </h1>

            <div className="completion-score-card">
              <div className="score-label">Your Latest Score</div>
              <div className="score-value">
                {previousResult.earnedPoints}/{previousResult.totalPoints}
              </div>
              <div className="score-percentage">{percentage}% Correct</div>
              <div className="completion-progress-bar">
                <div
                  className="completion-progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="muted">
                Submitted:{" "}
                {new Date(previousResult.submittedAt).toLocaleString()}
              </p>
            </div>

            <div className="plc-intro-actions">
              <button
                className="btn secondary small"
                type="button"
                onClick={handleRetake}
              >
                Retake Quiz
              </button>
              <button
                className="btn small ready-btn"
                type="button"
                onClick={handleProceed}
              >
                Proceed
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <button
            className="btn secondary small"
            type="button"
            onClick={() => navigate("/student/plc")}
          >
            Back
          </button>
          <StudentMenu />
        </div>
      </header>

      <main className="plc-quiz-content">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {currentQuestion && (
          <div className="question-container">
            {error ? <p className="error-text">{error}</p> : null}

            <div className="question-card">
              <h2 className="question-number">
                {currentQuestion.orderNumber}. {currentQuestion.questionText}
              </h2>

              <div className="choices-container">
                {currentQuestion.questionType === "multiple_choice" &&
                  currentQuestion.choices
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((choice) => (
                      <label key={choice.id} className="radio-choice">
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          checked={
                            answers[currentQuestion.id]?.selectedChoiceId ===
                            choice.id
                          }
                          onChange={() =>
                            updateAnswer(currentQuestion.id, {
                              selectedChoiceId: choice.id,
                            })
                          }
                        />
                        <span className="choice-text">{choice.choiceText}</span>
                      </label>
                    ))}

                {currentQuestion.questionType === "true_false" && (
                  <>
                    <label className="radio-choice">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        checked={
                          answers[currentQuestion.id]?.selectedBoolean === true
                        }
                        onChange={() =>
                          updateAnswer(currentQuestion.id, {
                            selectedBoolean: true,
                          })
                        }
                      />
                      <span className="choice-text">True</span>
                    </label>
                    <label className="radio-choice">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        checked={
                          answers[currentQuestion.id]?.selectedBoolean === false
                        }
                        onChange={() =>
                          updateAnswer(currentQuestion.id, {
                            selectedBoolean: false,
                          })
                        }
                      />
                      <span className="choice-text">False</span>
                    </label>
                  </>
                )}

                {currentQuestion.questionType === "short_answer" && (
                  <textarea
                    className="short-answer-input"
                    rows={5}
                    value={answers[currentQuestion.id]?.answerText ?? ""}
                    onChange={(event) =>
                      updateAnswer(currentQuestion.id, {
                        answerText: event.target.value,
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="quiz-navigation">
          <button
            className="btn-nav btn-previous btn-sm"
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className="btn-nav btn-next btn-sm"
            type="button"
            onClick={handleNext}
            disabled={submitting || !isCurrentQuestionAnswered}
          >
            {submitting
              ? "Submitting..."
              : currentQuestionIndex === totalQuestions - 1
                ? "Submit"
                : "Next"}
          </button>
        </div>
        {!isCurrentQuestionAnswered ? (
          <p className="quiz-nav-hint muted">
            Answer the question to continue.
          </p>
        ) : null}
      </main>
    </div>
  );
}
