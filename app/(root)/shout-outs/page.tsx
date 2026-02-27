import CreateShoutOutDialog from "@/app/(root)/shout-outs/components/CreateShoutOutDialog";
import ShoutOutsTable from "@/app/(root)/shout-outs/components/ShoutOutsTable";
import PageContainer from "@/components/layout/PageContainer";
import PageTableContainer from "@/components/layout/PageTableContainer";

const ShoutOut = () => {
  return (
    <PageContainer title="Shout Outs" addButton={<CreateShoutOutDialog />}>
      <PageTableContainer>
        <ShoutOutsTable />
      </PageTableContainer>
    </PageContainer>
  );
};
export default ShoutOut;
