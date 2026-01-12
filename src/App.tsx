import { Toaster } from "sonner";
import { SkeletonWrapper } from "@/components/layout";
import { FormCreateJob } from "@/domain/jobs/components/FormCreateJob";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <SkeletonWrapper
        title="Qoolance - Create Job"
        description="Create a new job posting"
      >
        <div className="container py-8 px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Create a New Job</h1>
          <FormCreateJob />
        </div>
      </SkeletonWrapper>
    </>
  );
}

export default App;
