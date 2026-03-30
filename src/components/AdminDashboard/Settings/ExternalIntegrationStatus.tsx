import { FaRegClock } from "react-icons/fa";

import security from "@/assets/Logo/security.svg";
import { IoSettingsOutline } from "react-icons/io5";

const ExternalIntegrationStatus = () => {
  return (
    <div className=" bg-[#F9FAFB] p-4 rounded-lg h-full w-full space-y-3">
      <div>
        <div>
          <div className="flex items-center ">
            <img
              src={security}
              alt="Security Icon"
              className=" inline-block mr-2"
            />
            <h2 className="text-2xl font-semibold text-[#619DB5] ">
              External Integration Status
            </h2>
          </div>
        </div>
      </div>
      <hr className=" text-[#D3D6DC]" />
      {/* <EHRIntegrationStatus /> */}
      <div className="space-y-4.5">
        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2] rounded-lg">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-baseline items-center gap-2">
              <IoSettingsOutline className=" text-[#619DB5] inline-block mr-2 h-6 w-6" />
              <div>
                <h2 className="font-semibold text-lg">EHR Integration</h2>
                <div className=" flex justify-baseline items-center gap-5 ">
                  <p className="text-base text-[#63615F] gap-2 flex items-center">
                    <FaRegClock className=" inline-block " />
                    2025-10-06 16:20:15
                  </p>
                </div>
              </div>
            </div>
            <div className="w-21.75 h-7.5 flex justify-center items-center gap-2.5 px-4.5 py-1.75 rounded-full bg-[#D5FFDA]">
              <p className="text-[#2EBC03] font-medium ">connect</p>
            </div>
          </div>
        </div>
        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2] rounded-lg">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-baseline items-center gap-2">
              <IoSettingsOutline className=" text-[#619DB5] inline-block mr-2 h-6 w-6" />
              <div>
                <h2 className="font-semibold text-lg">EHR Integration</h2>
                <div className=" flex justify-baseline items-center gap-5 ">
                  <p className="text-base text-[#63615F] gap-2 flex items-center">
                    <FaRegClock className=" inline-block " />
                    2025-10-06 16:20:15
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[87px] h-[30px] flex justify-center items-center gap-[10px] px-[18px] py-[7px] rounded-full bg-[#D5FFDA]">
              <p className="text-[#2EBC03] font-medium ">connect</p>
            </div>
          </div>
        </div>
        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2] rounded-lg">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-baseline items-center gap-2">
              <IoSettingsOutline className=" text-[#619DB5] inline-block mr-2 h-6 w-6" />
              <div>
                <h2 className="font-semibold text-lg">EHR Integration</h2>
                <div className=" flex justify-baseline items-center gap-5 ">
                  <p className="text-base text-[#63615F] gap-2 flex items-center">
                    <FaRegClock className=" inline-block " />
                    2025-10-06 16:20:15
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[87px] h-[30px] flex justify-center items-center gap-[10px] px-[18px] py-[7px] rounded-full bg-[#D5FFDA]">
              <p className="text-[#2EBC03] font-medium ">Error</p>
            </div>
          </div>
        </div>
        <div className=" text-black w-full space-y-1 p-4 bg-white border border-[#F6F4F2] rounded-lg">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-baseline items-center gap-2">
              <IoSettingsOutline className=" text-[#619DB5] inline-block mr-2 h-6 w-6" />
              <div>
                <h2 className="font-semibold text-lg">EHR Integration</h2>
                <div className=" flex justify-baseline items-center gap-5 ">
                  <p className="text-base text-[#63615F] gap-2 flex items-center">
                    <FaRegClock className=" inline-block " />
                    2025-10-06 16:20:15
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[87px] h-[30px] flex justify-center items-center gap-[10px] px-[18px] py-[7px] rounded-full bg-[#D5FFDA]">
              <p className="text-[#2EBC03] font-medium ">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalIntegrationStatus;
