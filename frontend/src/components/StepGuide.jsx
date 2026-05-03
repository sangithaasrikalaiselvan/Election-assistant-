import { memo, useMemo, useState } from "react";

/**
 * A component to display the election steps interactively.
 * @param {{ steps: Array, loading: boolean }} props
 */
const StepGuide = ({ steps, loading }) => {
  const [index, setIndex] = useState(0);
  const currentStep = useMemo(() => steps[index], [steps, index]);
  const progressValue = useMemo(
    () => Math.round(((index + 1) / Math.max(steps.length, 1)) * 100),
    [index, steps.length]
  );

  if (loading) {
    return <div className="card">Loading guide...</div>;
  }

  if (!currentStep) {
    return <div className="card">Guide data is unavailable.</div>;
  }

  return (
    <div className="card guide-card">
      <div className="guide-header">
        <span className="badge">Step {index + 1}</span>
        <span className="icon-pill" aria-hidden="true">
          {currentStep.icon}
        </span>
        <h3>{currentStep.title}</h3>
      </div>
      <p>{currentStep.description}</p>
      <div className="progress" aria-label="Guide progress">
        <div className="progress-bar" style={{ width: `${progressValue}%` }} />
        <span className="progress-text">{progressValue}% complete</span>
      </div>
      <div className="guide-actions">
        <button
          type="button"
          onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
          disabled={index === 0}
          aria-label="Previous step"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setIndex((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={index === steps.length - 1}
          aria-label="Next step"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default memo(StepGuide);
