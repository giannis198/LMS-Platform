// "use client";

// import { Plus } from "lucide-react";
// import { Button } from "../ui/button";

// import { Separator } from "../ui/separator";
// import { useParams, useRouter } from "next/navigation";
// import { CourseColumns, column } from "../columns/CourseColumns";





// interface Props {
//   data: CourseColumns[];
// }

// const ProductClient = ({ data }: Props) => {
//   const router = useRouter();
//   const params = useParams();
//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add New
//         </Button>
//       </div>
//       <Separator />
//       <DataTable columns={columns} data={data} searchKey="name" />
//       <Heading title="API" description="API calls for Products" />
//       <Separator />
//       <ApiList entityIdName="productId" entityName="products" />
//     </>
//   );
// };

// export default ProductClient;
