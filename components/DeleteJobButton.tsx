"use client";
import React from 'react';

interface DeleteJobButtonProps {
    jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this job?")) {
            try {
                const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
                if (res.ok) {
                    window.location.reload();
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to delete job");
                }
            } catch (err) {
                alert("An error occurred while deleting the job");
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Delete Job"
        >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}
