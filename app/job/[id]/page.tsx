import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface JobAdvertProps {
  params: { id: string };
}

// Optionally, you can fetch job data here
async function getJobData(id: string) {
  // Replace with real data fetching logic
  // For now, just return a mock object
  if (!id) return null;
  return {
    id,
    title: `Job Title for ${id}`,
    description: `This is a placeholder description for job ${id}.`,
    department: "Department Name",
    location: "Location Name",
    salary: "£30,000 - £40,000",
  };
}


export async function generateMetadata({ params }: JobAdvertProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobData(id);
  return {
    title: job ? job.title : "Job not found",
    description: job ? job.description : "No job found for this ID.",
  };
}


export default async function JobAdvertPage({ params }: JobAdvertProps) {
  const { id } = await params;
  const job = await getJobData(id);
  if (!job) return notFound();

  return (
    <div className="govuk-width-container govuk-!-margin-top-6">
      <h1 className="govuk-heading-l">{job.title}</h1>
      <p className="govuk-body">{job.description}</p>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Department</dt>
          <dd className="govuk-summary-list__value">{job.department}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Location</dt>
          <dd className="govuk-summary-list__value">{job.location}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Salary</dt>
          <dd className="govuk-summary-list__value">{job.salary}</dd>
        </div>
      </dl>
    </div>
  );
}
