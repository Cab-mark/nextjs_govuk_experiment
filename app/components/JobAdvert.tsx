import { Job } from '../lib/mockJobs';

function renderTextWithBullets(blob: string, keyPrefix: string = "") {
  if (!blob) return null;
  const lines = blob.split('\n');
  const result: React.ReactNode[] = [];
  let bulletItems: string[] = [];

  function flushBullets() {
    if (bulletItems.length > 0) {
      result.push(
        <ul className="govuk-list govuk-list--bullet" key={keyPrefix + "-ul-" + result.length}>
          {bulletItems.map((item, idx) => <li key={keyPrefix + "-li-" + idx}>{item}</li>)}
        </ul>
      );
      bulletItems = [];
    }
  }

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('* ')) {
      bulletItems.push(line.replace(/^\*\s*/, ''));
    } else if (line.trim() !== "") {
      flushBullets();
      result.push(<p className="govuk-body" key={keyPrefix + "-p-" + idx}>{line}</p>);
    }
  });
  flushBullets();
  return result;
}

export default function JobAdvert({ job }: { job: Job }) {
  return (
    <>
      <h2 className="govuk-heading-l">About the job</h2>
      {job.summary && (
        <>
          <h3 className="govuk-heading-m">Summary</h3>
          {renderTextWithBullets(job.summary, "summary")}
        </>
      )}
      <h3 className="govuk-heading-m">Description</h3>
      {renderTextWithBullets(job.description, "desc")}
      <h2 className="govuk-heading-l">What we are looking for</h2>
      {renderTextWithBullets(job.personalSpec, "personalSpec")}
       {job.benefits && (
      <>
      <h2 className="govuk-heading-l">Benefits</h2>
      {renderTextWithBullets(job.benefits, "benefits")}
      </>
       )}
    </>
  );
}  