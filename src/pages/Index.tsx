import { AppShell } from "@/components/AppShell";
import { ActionBanner } from "@/components/dashboard/ActionBanner";
import { PipelineFunnel } from "@/components/dashboard/PipelineFunnel";
import { AnalyticsTiles } from "@/components/dashboard/AnalyticsTiles";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CandidateTable } from "@/components/dashboard/CandidateTable";

const Index = () => {
  return (
    <AppShell title="Recruitment Dashboard">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 animate-fade-in">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-h1">Good morning, Linh</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's what's moving across your hiring pipeline today — Tuesday, April 21
            </p>
          </div>
        </div>

        <ActionBanner />
        <PipelineFunnel />
        <AnalyticsTiles />
        <FilterBar />
        <CandidateTable />
      </div>
    </AppShell>
  );
};

export default Index;
