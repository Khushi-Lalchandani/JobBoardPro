import React from 'react'

const EditJobPage = ({ params }: { params: { id: string } }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Edit Job</h1>
                <p className="text-indigo-400 text-sm">Editing job <span className="font-mono text-indigo-300">{params.id}</span></p>
                <a
                    href="/company/dashboard"
                    className="mt-6 inline-block rounded-lg border border-white/10 text-indigo-300 hover:bg-white/10 px-6 py-2 text-sm font-medium transition-colors"
                >
                    ← Back to Dashboard
                </a>
            </div>
        </div>
    )
}

export default EditJobPage