import AllProduct from "./_components/all_product";

const ProductPage = async () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <AllProduct />
      </div>
    </div>
  );
};

export default ProductPage;
