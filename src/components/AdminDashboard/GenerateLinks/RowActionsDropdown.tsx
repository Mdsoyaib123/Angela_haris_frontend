import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useClick,
  useRole,
} from "@floating-ui/react";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDeleteOrganizationMutation } from "@/redux/features/organization/organizationApi";
import { Landmark, Loader2 } from "lucide-react";
import UpdateActionModal from "./UpdateActionModal";
import TransferCommissionModal from "./TransferCommissionModal";
import Swal from "sweetalert2"; // Import SweetAlert2

interface RowActionsDropdownProps {
  userData: any;
}

export default function RowActionsDropdown({
  userData,
}: RowActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const [deleteOrganization, { isLoading: isDeleting }] =
    useDeleteOrganizationMutation();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // SweetAlert delete handler
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${userData.organizationName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrganization(userData.id).unwrap();
        Swal.fire("Deleted!", "Organization has been deleted.", "success");
        setIsOpen(false); // ensure dropdown is closed
      } catch (err: any) {
        Swal.fire(
          "Error!",
          err?.data?.message || "Failed to delete organization",
          "error",
        );
      }
    }
  };

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
      >
        <CiMenuKebab size={20} className="text-gray-500" />
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 min-w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Manage Organization */}
            <button
              onClick={() => {
                setIsUpdateOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer group"
            >
              <MdOutlineFileUpload
                size={18}
                className="text-gray-400 group-hover:text-blue-500"
              />
              Manage Organization
            </button>

            {/* Transfer Commission */}
            <button
              onClick={() => {
                setIsTransferOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer group"
            >
              <Landmark
                size={18}
                className="text-gray-400 group-hover:text-amber-500"
              />
              Transfer Commission
            </button>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            {/* Delete Entry */}
            <button
              onClick={() => {
                setIsOpen(false); // close dropdown immediately
                handleDelete(); // trigger SweetAlert
              }}
              disabled={isDeleting}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin text-red-400" />
              ) : (
                <RiDeleteBinLine
                  size={18}
                  className="text-red-400 group-hover:text-red-500"
                />
              )}
              Delete Entry
            </button>
          </div>
        </FloatingPortal>
      )}

      <UpdateActionModal
        isOpen={isUpdateOpen}
        orgData={userData}
        onClose={() => setIsUpdateOpen(false)}
      />
      <TransferCommissionModal
        isOpen={isTransferOpen}
        orgData={userData}
        onClose={() => setIsTransferOpen(false)}
      />
    </>
  );
}
