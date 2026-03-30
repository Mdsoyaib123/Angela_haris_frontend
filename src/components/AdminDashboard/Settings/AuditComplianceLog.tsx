import { FaRegClock } from "react-icons/fa";

import security from "@/assets/Logo/security.svg";
import ballicon from "@/assets/Logo/ballicon.svg";

const AuditComplianceLog = () => {
  return (
    <div className="bg-[#F9FAFB] p-4 rounded-lg h-full w-full space-y-3">
      <div>
        <div>
          <div className="flex items-center ">
            <img
              src={security}
              alt="Security Icon"
              className=" inline-block mr-2"
            />
            <h2 className="text-2xl font-semibold text-[#619DB5] ">
              Audit & Compliance Log
            </h2>
          </div>
        </div>
        <p className="text-sm text-[#A7A5A1]">
          Last 10 system configuration changes and administrative actions
        </p>
      </div>
      <hr className=" text-[#D3D6DC]" />
      <div className="space-y-4.5">
        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2]  rounded-lg">
          <h2 className="font-semibold text-lg">
            Updated medication protocol configuration
          </h2>
          <div className=" flex justify-baseline items-center gap-5 ">
            <p className="text-base text-[#63615F] gap-2 flex items-center">
              <FaRegClock className=" inline-block " />
              2025-10-06 16:20:15
            </p>
            <p className="text-base text-[#63615F] ">
              {" "}
              <img src={ballicon} alt="" className="inline-block mr-2" />
              admin 01
            </p>
          </div>
        </div>

        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2]  rounded-lg">
          <h2 className="font-semibold text-lg">
            Changed system timezone configuration
          </h2>
          <div className=" flex justify-baseline items-center gap-5 ">
            <p className="text-base text-[#63615F] gap-2 flex items-center">
              <FaRegClock className=" inline-block " />
              2025-10-06 16:20:15
            </p>
            <p className="text-base text-[#63615F] ">
              {" "}
              <img src={ballicon} alt="" className="inline-block mr-2" />
              admin 02
            </p>
          </div>
        </div>

        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2]  rounded-lg">
          <h2 className="font-semibold text-lg">
            Disabled inactive user account: ts03
          </h2>
          <div className=" flex justify-baseline items-center gap-5 ">
            <p className="text-base text-[#63615F] gap-2 flex items-center">
              <FaRegClock className=" inline-block " />
              2025-10-06 16:20:15
            </p>
            <p className="text-base text-[#63615F] ">
              {" "}
              <img src={ballicon} alt="" className="inline-block mr-2" />
              admin 03
            </p>
          </div>
        </div>

        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2]  rounded-lg">
          <h2 className="font-semibold text-lg">
            Updated external EHR integration settings
          </h2>
          <div className=" flex justify-baseline items-center gap-5 ">
            <p className="text-base text-[#63615F] gap-2 flex items-center">
              <FaRegClock className=" inline-block " />
              2025-10-06 16:20:15
            </p>
            <p className="text-base text-[#63615F] ">
              {" "}
              <img src={ballicon} alt="" className="inline-block mr-2" />
              admin 04
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditComplianceLog;
