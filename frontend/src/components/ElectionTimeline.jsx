import { memo, useEffect, useMemo, useState } from "react";
import TimelineCard from "./TimelineCard";
import { electionTimeline } from "../data/timelineData";
import { getTimelineStatus } from "../utils/timelineStatus";

const ElectionTimeline = ({ data }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const today = useMemo(() => new Date(), []);
  const timeline = data || electionTimeline;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedPhase(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const enrichedTimeline = useMemo(
    () =>
      timeline.map((phase) => ({
        ...phase,
        status: getTimelineStatus(today, phase.startDate, phase.endDate),
      })),
    [timeline, today]
  );

  const activeIndex = enrichedTimeline.findIndex((phase) => phase.status === "ACTIVE");
  const progressLabel =
    activeIndex >= 0
      ? `Step ${activeIndex + 1} of ${enrichedTimeline.length}`
      : "No active phase";

  if (!enrichedTimeline.length) {
    return <div className="card">Timeline data is unavailable.</div>;
  }

  return (
    <div className="timeline-wrapper">
      <div className="timeline-meta">
        <span className="timeline-progress">{progressLabel}</span>
        <span className="timeline-today">Today: {today.toISOString().slice(0, 10)}</span>
      </div>
      <div className="timeline-grid">
        {enrichedTimeline.map((phase) => (
          <TimelineCard
            key={phase.id}
            title={phase.title}
            startDate={phase.startDate}
            endDate={phase.endDate}
            description={phase.description}
            status={phase.status}
            isActive={phase.status === "ACTIVE"}
            onClick={() => setSelectedPhase(phase)}
          />
        ))}
      </div>

      {selectedPhase && (
        <div className="modal-overlay" role="presentation">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="timeline-modal-title"
          >
            <h3 id="timeline-modal-title">{selectedPhase.title}</h3>
            <p className="timeline-window">
              {selectedPhase.startDate} to {selectedPhase.endDate}
            </p>
            <p>{selectedPhase.description}</p>
            <button
              type="button"
              className="timeline-button"
              onClick={() => setSelectedPhase(null)}
              aria-label="Close details"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ElectionTimeline);
