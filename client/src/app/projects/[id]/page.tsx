"use client";

import React, { use, useState } from 'react'
import ProjectHeader from "@/projects/ProjectHeader";
import Boardview from '@/projects/BoardView';
type Props = {
    params: Promise<{ id: string }>,
}

const Project = ({ params }: Props) => {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState("Board");
    const [isModelNewTaskOpen, setIsModelNewTaskOpen] = useState(false);


    return (
        // {Model new task}
        <div>
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {
                activeTab === "Board" && (
                    <Boardview id={id} setIsModelNewTaskOpen={setIsModelNewTaskOpen} />
                )
            }
        </div>
    )
}


export default Project