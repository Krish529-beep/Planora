"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setisSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use, useState } from "react";

type Props = {};

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery()
  console.log('data', projects)
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40
    bg-white dark:bg-dark-bg overflow-y-auto ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
    `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* {TOPLOGO} */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white dark:bg-dark-bg px-6">
          <div className="text-xl font-bold text-gray-800 dark:text-white">Planora</div>
          {isSidebarCollapsed ? null : (
            <button className="py-3" onClick={() => { dispatch(setisSidebarCollapsed(!isSidebarCollapsed)) }}>
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )

          }
        </div>
        {/* {TEAM} */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 dark:border-gray-700 px-8 py-4">
          <Image
            src="/logo.png"
            loading="eager"
            alt="logo"
            width={40}
            height={40}
          />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">GET DONE</h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* {navbar links} */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="home" href='/' />
          <SidebarLink icon={Briefcase} label="timeline" href='/timeline' />
          <SidebarLink icon={Search} label="Search" href='/search' />
          <SidebarLink icon={Settings} label="Settings" href='/settings' />
          <SidebarLink icon={User} label="Users" href='/users' />
          <SidebarLink icon={Users} label="Teams" href='/teams' />
        </nav>

        {/* {Projects Links} */}
        <button onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {
            showProjects ? (
              <ChevronUp className="h-5 w-5 dark:text-white" />
            ) : <ChevronDown className="h-5 w-5 dark:text-white" />
          }
        </button>
        {/* {Projects list} */}
        {
          showProjects && projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))
        }
        {/* {Priorites links} */}
        <button onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priorites</span>
          {
            showPriority ? (
              <ChevronUp className="h-5 w-5 dark:text-white" />
            ) : <ChevronDown className="h-5 w-5 dark:text-white" />
          }
        </button>
        {showPriority && (
          <>
            <SidebarLink icon={AlertCircle} label="Urgent" href='/priority/urgent' />
            <SidebarLink icon={ShieldAlert} label="High" href='/priority/high' />
            <SidebarLink icon={AlertTriangle} label="Medium" href='/priority/medium' />
            <SidebarLink icon={AlertOctagon} label="Low" href='/priority/low' />
            <SidebarLink icon={Layers3} label="Backlog" href='/priority/backlog' />
          </>
        )

        }

      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string,
  icon: LucideIcon,
  label: string,
  isCollapsed: boolean
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,

}) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full ">
      <div className={`relative flex cursor-pointer items-center gap-3 transition-colors
        hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3 
      `}>
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  )
}


export default Sidebar;
