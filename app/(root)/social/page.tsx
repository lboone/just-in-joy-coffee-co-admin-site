import CreateSocialDialog from "@/app/(root)/social/components/CreateSocialDialog";
import SocialsTable from "@/app/(root)/social/components/SocialsTable";
import PageContainer from "@/components/layout/PageContainer";
import PageTableContainer from "@/components/layout/PageTableContainer";

const Social = () => {
  return (
    <PageContainer title="Socials" addButton={<CreateSocialDialog />}>
      <PageTableContainer>
        <SocialsTable />
      </PageTableContainer>
    </PageContainer>
  );
};
export default Social;
