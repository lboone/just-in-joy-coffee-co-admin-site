import CreateFeaturedDrinkDialog from "@/app/(root)/featured-drinks/components/CreateFeaturedDrinkDialog";
import FeaturedDrinksTable from "@/app/(root)/featured-drinks/components/FeaturedDrinksTable";
import PageContainer from "@/components/layout/PageContainer";
import PageTableContainer from "@/components/layout/PageTableContainer";

const FeaturedDrink = () => {
  return (
    <PageContainer
      title="Featured Drinks"
      addButton={<CreateFeaturedDrinkDialog />}
    >
      <PageTableContainer>
        <FeaturedDrinksTable />
      </PageTableContainer>
    </PageContainer>
  );
};
export default FeaturedDrink;
