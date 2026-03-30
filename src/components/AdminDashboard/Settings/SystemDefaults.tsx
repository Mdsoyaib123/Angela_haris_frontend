import { Button } from "@/components/ui/button";
import { IoSettingsOutline } from "react-icons/io5";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SystemDefaults = () => {
  return (
    <div className="  bg-[#F9FAFB] p-4 rounded-lg h-full w-full space-y-3">
      <div>
        <h2 className="text-2xl font-semibold text-[#619DB5] mb-6">
          <IoSettingsOutline className=" inline-block mr-2" />
          System Defaults
        </h2>
      </div>
      <hr className=" text-[#D3D6DC]" />
      <div className="space-y-2">
        <div className=" text-black w-full space-y-1">
          <h2 className="font-semibold">
            Default Timezone{" "}
            <span className="text-[#A7A5A1]">(Applied to all new users)</span>:
          </h2>
          {/* <select
            name="est"
            id=""
            className=" w-full flex items-center h-[40px] px-[14px] py-[24px] gap-[10px] shrink-0 self-stretch rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_rgba(228,229,229,0.4)] text-black"
          >
            <option value="est">EST (Eastern Standard Time)</option>
            <option value="cst">CST (Central Standard Time)</option>
            <option value="pst">PST (Pacific Standard Time)</option>
          </select> */}
          <div>
            <Select>
              <SelectTrigger className="w-full cursor-pointer border border-[#C6CAD1] py-3 rounded-xl bg-white">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent className="border-none cursor-pointer">
                <SelectGroup className="bg-white shadow-2xl rounded-sm">
                  <SelectLabel>Default Timezone</SelectLabel>

                  <SelectItem
                    value="UTC-12:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-12:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-11:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-11:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-10:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-10:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-09:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-09:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-08:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-08:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-07:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-07:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-06:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-06:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-05:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-05:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-04:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-04:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-03:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-03:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-02:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-02:00
                  </SelectItem>
                  <SelectItem
                    value="UTC-01:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC-01:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+00:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+00:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+01:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+01:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+02:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+02:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+03:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+03:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+04:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+04:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+05:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+05:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+06:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+06:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+07:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+07:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+08:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+08:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+09:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+09:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+10:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+10:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+11:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+11:00
                  </SelectItem>
                  <SelectItem
                    value="UTC+12:00"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    UTC+12:00
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="  text-black space-y-1">
          <h2 className="font-semibold">
            Clinical Data Retention (Days){" "}
            <span className="text-[#A7A5A1]">(Before archival)</span>
          </h2>
          <input
            type="text"
            placeholder="60"
            className=" w-full flex items-center h-[40px] px-[14px] py-[22px] gap-[10px] shrink-0 self-stretch rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_rgba(228,229,229,0.4)] text-black"
          />
          <p className="text-sm text-[#A7A5A1]">
            Recommended: 90-120 days for optimal compliance
          </p>
        </div>

        <div className=" text-black w-full space-y-1">
          <h2 className="font-semibold">
            Default Charting Period{" "}
            <span className="text-[#A7A5A1]">
              (Clinical documentation cycle)
            </span>
          </h2>
          {/* <select
            name="12-Hour Shift"
            id=""
            className=" w-full flex items-center h-[46px] px-[14px] py-[24px] gap-[10px] shrink-0 self-stretch rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_rgba(228,229,229,0.4)] text-black"
          >
            <option value="12-Hour Shift">12-Hour Shift</option>
            <option value="12-Hour Shift">12-Hour Shift</option>
            <option value="24-Hour Shift">24-Hour Shift</option>
            <option value="8-Hour Shift">8-Hour Shift</option>
          </select> */}
          <div>
            <Select>
              <SelectTrigger className="w-full cursor-pointer border border-[#C6CAD1] py-3 rounded-xl bg-white">
                <SelectValue placeholder="Select Charting Period" />
              </SelectTrigger>
              <SelectContent className="border-none cursor-pointer">
                <SelectGroup className="bg-white shadow-2xl rounded-sm">
                  <SelectLabel>Default Charting Period</SelectLabel>

                  <SelectItem
                    value="daily"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    Daily
                  </SelectItem>
                  <SelectItem
                    value="weekly"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    Weekly
                  </SelectItem>
                  <SelectItem
                    value="biweekly"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    Bi-Weekly
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    Monthly
                  </SelectItem>
                  <SelectItem
                    value="quarterly"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    Quarterly
                  </SelectItem>
                  <SelectItem
                    value="custom"
                    className="hover:bg-[#E4E8EA] cursor-pointer"
                  >
                    Custom
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Button className=" cursor-pointer text-base w-full  bg-[#346778] hover:bg-[#2c4a54] text-[#F9F8F6] font-medium px-4 py-3 rounded-lg shadow-sm flex items-center justify-center">
            Save Configuration
          </Button>
        </div>
      </div>
      <hr className=" border-[#D3D6DC]" />
      <div>
        <p className="text-sm text-[#A7A5A1]">
          All configuration changes are logged in the Audit & Compliance Log
          section below to maintain HIPAA compliance and system integrity.
        </p>
      </div>
    </div>
  );
};

export default SystemDefaults;
