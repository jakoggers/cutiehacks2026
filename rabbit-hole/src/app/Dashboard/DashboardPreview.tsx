
import Dashboard from "./page";
import { JourneyProvider } from "@/src/components/Dashboard/JourneyContext";
import { mockProfile } from "@/src/components/Dashboard/dashboardPreviewData";

const DashboardPreview = () => {
  return (
    <JourneyProvider
      initialProfile={mockProfile}
      persist={false}
    >
      <Dashboard />
    </JourneyProvider>
  );
};

export default DashboardPreview;
