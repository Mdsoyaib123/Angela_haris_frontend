import { CiMenuKebab } from "react-icons/ci";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import { LuShieldCheck, LuLayers } from "react-icons/lu";
import { RiDeleteBinLine, RiUserForbidLine } from "react-icons/ri";
import { useState } from "react";
import { User } from "@/redux/types/AdminAllUserType";
import Swal from "sweetalert2"; // import SweetAlert2
import UpdatePlanModal from "./UpdatePlanModal";

interface RowActionsDropdownProps {
  user: User;
  onManageRole: (user: User) => void;
  onDeactivate: (user: User) => void;
  onDelete: (user: User) => void;
  onViewProfile: (user: User) => void;
}

export default function RowActionsDropdown({
  user,
  // onManageRole,   // not used currently
  onDeactivate,
  onDelete,
  onViewProfile,
}: RowActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isUpdatePlanOpen, setIsUpdatePlanOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const handleMenuItemClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    setOpen(false);
    callback();
  };

  // Function to show confirmation modal for deactivation/reactivation
  const confirmDeactivation = () => {
    const isActive = user.isActive;
    Swal.fire({
      title: isActive ? "Deactivate User?" : "Reactivate User?",
      text: isActive
        ? "Are you sure you want to deactivate this user? They will lose access."
        : "Are you sure you want to reactivate this user? They will regain access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: isActive ? "Yes, deactivate" : "Yes, reactivate",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeactivate(user);
      }
    });
  };

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          onClick: () => setOpen((v) => !v),
        })}
        className="text-base text-[#1E242C] font-medium cursor-pointer"
      >
        <CiMenuKebab className="text-[#2EBC03]" />
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-30 w-fit rounded-md bg-white shadow-lg border border-gray-200"
          >
            <ul className="p-2 text-sm rounded-md space-y-2">
              <li
                className="flex items-center gap-3 px-4 py-2 cursor-pointer bg-[#E6F6ED] border border-[#B0E4C7] rounded-sm transition hover:opacity-80"
                onClick={(e) =>
                  handleMenuItemClick(e, () => onViewProfile(user))
                }
              >
                <LuShieldCheck className="text-[#475569] h-6 w-6" />
                <span className="text-[#475569] font-medium text-lg">
                  User Details
                </span>
              </li>

              <li
                className="flex items-center gap-3 px-4 py-2 cursor-pointer bg-[#E6F6ED] border border-[#B0E4C7] rounded-sm transition hover:opacity-80"
                onClick={(e) =>
                  handleMenuItemClick(e, () => setIsUpdatePlanOpen(true))
                }
              >
                <LuLayers className="text-[#475569] h-6 w-6" />
                <span className="text-[#475569] font-medium text-lg">
                  Update Plan
                </span>
              </li>

              <li
                className="flex items-center gap-3 px-4 py-2 cursor-pointer bg-[#E6F6ED] border border-[#B0E4C7] rounded-sm transition hover:opacity-80"
                onClick={
                  (e) => handleMenuItemClick(e, confirmDeactivation) // use confirmation
                }
              >
                <RiUserForbidLine className="text-[#475569] h-6 w-6" />
                <span className="text-[#475569] font-medium text-lg">
                  {user.isActive ? "Deactivate User" : "Reactivate User"}
                </span>
              </li>

              <li
                className="flex items-center gap-3 px-4 py-2 cursor-pointer bg-[#E6F6ED] border border-[#B0E4C7] rounded-sm transition hover:opacity-80"
                onClick={(e) => handleMenuItemClick(e, () => onDelete(user))}
              >
                <RiDeleteBinLine className="text-[#FF0000] h-6 w-6" />
                <span className="text-[#FF0000] font-medium text-lg">
                  Delete
                </span>
              </li>
            </ul>
          </div>
        </FloatingPortal>
      )}
      <UpdatePlanModal
        isOpen={isUpdatePlanOpen}
        onClose={() => setIsUpdatePlanOpen(false)}
        userId={user.id}
        currentPlan={user.subscribeStatus}
        userName={user.athleteFullName}
      />
    </>
  );
}
