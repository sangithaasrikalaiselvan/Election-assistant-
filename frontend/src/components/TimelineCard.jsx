import { memo } from "react";
import { formatTimelineRange } from "../utils/timelineStatus";

const STATUS_STYLES = {
  COMPLETED: "status-completed",
  ACTIVE: "status-active",
  UPCOMING: "status-upcoming",
};

/**
 * A card component displaying a single phase of the election timeline.
 * @param {{
 *   title: string,
 *   startDate: string,
 *   endDate: string,
 *   description: string,
 *   status: string,
 *   isActive: boolean,
 *   onClick: () => void
 * }} props
 */
const TimelineCard = ({
  title,
  startDate,
  endDate,
  description,
  status,
  isActive,
  onClick,
}) => (
  <article
    className={`timeline-card ${STATUS_STYLES[status]} ${
      isActive ? "timeline-active" : ""
    }`}
    aria-label={`${title} phase`}
  >
    <div className="timeline-header">
      <h3>{title}</h3>
      <span className="status-pill">{status}</span>
    </div>
    <p className="timeline-window">{formatTimelineRange(startDate, endDate)}</p>
    <p>{description}</p>
    <button
      type="button"
      className="timeline-button"
      onClick={onClick}
      aria-label={`View details for ${title}`}
    >
      View details
    </button>
  </article>
);

export default memo(TimelineCard);
