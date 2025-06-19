export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import ProductDetail from "./_components/product_detail";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  void api.adminRoute.product.getOne.prefetch({
    id,
  });
  void api.adminRoute.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ProductDetail productId={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default ProductDetailPage;
