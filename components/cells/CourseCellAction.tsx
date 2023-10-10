// "use client";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "../ui/button";
// import { Edit, MoreHorizontal, Trash } from "lucide-react";
// import toast from "react-hot-toast";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { useState } from "react";


// import { ConfirmModal } from "../modals/ConfirmModal";
// import { CourseColumns } from "../columns/CourseColumns";

// interface Props {
//   data: CourseColumns;
// }

// const CourseCellAction = ({ data }: Props) => {
//   const router = useRouter();
//   const params = useParams();

//   const [loading, setloading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const onDelete = async () => {
//     try {
//       setloading(true);
//       await axios.delete(`/api/teacher/courses/${data.id}`);
//       router.refresh();
//       toast.success("Course deleted.");
//     } catch (error: any) {
//       toast.error(
//         "Something went wrong."
//       );
//     } finally {
//       setloading(false);
//       setOpen(false);
//     }
//   };

//   const onUpdate = () => {
//     router.push(`/teacher/courses/${data.id}`);
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuItem onClick={() => onUpdate()}>
//             <Edit className="mr-2 h-4 w-4" />
//             Update
//           </DropdownMenuItem>

//           <DropdownMenuItem>
//             <ConfirmModal onConfirm={() => onDelete()}>
//               <Button variant="destructive" size="sm" disabled={loading}>
//                 <Trash className="h-4 w-4" />
//               </Button>
//             </ConfirmModal>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };

// export default CourseCellAction;
