"use client";
import { LockIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setshowPriority] = useState(true);

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40
    bg-white overflow-y-auto w-64 
    `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* {TOPLOGO} */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6">
          <div className="text-xl font-bold text-gray-800">Planora</div>
        </div>
        {/* {TEAM} */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4">
            <Image src="/logo.png" loading="eager" alt="logo" width={40} height={40} />
            <div>
                <h3 className="text-md font-bold tracking-wide ">
                   GET DONE
                </h3>
                <div className="mt-1 flex items-start gap-2">
                    <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500"/>
                    <p className="text-xs text-gray-500">Private</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
