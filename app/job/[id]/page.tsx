import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJobById, Job } from "../../lib/mockJobs";
import JobDetails from "../../components/JobDetails";
import JobAdvert from "@/app/components/JobAdvert";

interface JobAdvertProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobAdvertProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  return {
    title: job ? job.title : "Job not found",
    description: job ? job.description : "No job found for this ID.",
  };
}

export default async function JobAdvertPage({ params }: JobAdvertProps) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return notFound();

  return (
    <div className="govuk-width-container govuk-!-margin-top-6">
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
  <JobDetails job={job as Job} />
  <JobAdvert job={job as Job} />
      </div>
    </div>
    </div>
  );
}
