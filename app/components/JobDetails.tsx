import { Job } from '../lib/mockJobs';

export default function JobDetails({ job }: { job: Job }) {
  return (
    <>
      <span className="govuk-caption-xl">{job.organisation}</span>
      <h1 className="govuk-heading-xl">{job.title}</h1>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Job reference</dt>
          <dd className="govuk-summary-list__value">{job.id}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Location</dt>
          <dd className="govuk-summary-list__value">
            {Array.isArray(job.location) && job.location.length > 0
              ? job.location
                  .map(loc => {
                    if (!loc) return '';
                    // Check for overseasLocations type
                    if ('countryName' in loc) {
                      // overseasLocations
                      return loc.locationDisplay || loc.countryName;
                    } else {
                      // fixedLocations
                      if (loc.formattedAddress) {
                        return loc.formattedAddress;
                      }
                      const address = [
                        loc.saoText,
                        loc.paoText,
                        loc.streetDescription,
                        loc.locality,
                        loc.townName,
                        loc.postTown,
                        loc.postcode
                      ]
                        .filter(Boolean)
                        .join(', ');
                      return address || Object.values(loc).join(' ').trim();
                    }
                  })
                  .filter(Boolean)
                  .join(' | ')
              : typeof job.location === 'string'
                ? job.location
                : ''}
          </dd>
        </div>
        {job.salary && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Salary</dt>
            <dd className="govuk-summary-list__value">{job.salary}</dd>
          </div>
        )}
        <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Contract type</dt>
            <dd className="govuk-summary-list__value">{job.assignmentType}</dd>
          </div>
        {job.jobNumbers && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Number of jobs</dt>
            <dd className="govuk-summary-list__value">{job.jobNumbers}</dd>
          </div>
        )}
        {job.profession && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Profession</dt>
            <dd className="govuk-summary-list__value">{job.profession}</dd>
          </div>
        )}
        {job.closingDate && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Closing date</dt>
            <dd className="govuk-summary-list__value">{job.closingDate}</dd>
          </div>
        )}
      </dl>
      {job.applyUrl && (
        <a
          href={job.applyUrl}
          className="govuk-button"
          target="_blank"
          role="button"
          rel="noopener noreferrer"
        >
          Apply on advertiser's site
        </a>
      )}
    </>
  );
}