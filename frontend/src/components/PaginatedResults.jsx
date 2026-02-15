import { useState } from "react";
import ResultCard from "./ResultCard";

export default function PaginatedResults({ results }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(results.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = results.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded transition-all ${i === currentPage
                            ? "bg-cyber-orange text-black font-bold"
                            : "bg-white/10 hover:bg-white/20 text-gray-300"
                        }`}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    if (results.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-2 h-8 bg-cyber-orange rounded-sm inline-block"></span>
                    Analysis Results
                </h3>
                <div className="text-sm text-gray-400 font-mono">
                    Showing {startIndex + 1}-{Math.min(endIndex, results.length)} of {results.length}
                </div>
            </div>

            <div className="grid gap-4">
                {currentResults.map((r, i) => (
                    <ResultCard key={startIndex + i} text={r.text} label={r.label} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all text-sm font-bold uppercase tracking-wider"
                    >
                        ← Prev
                    </button>

                    <div className="flex gap-1">
                        {currentPage > 3 && totalPages > 5 && (
                            <>
                                <button
                                    onClick={() => goToPage(1)}
                                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
                                >
                                    1
                                </button>
                                {currentPage > 4 && <span className="px-2 py-1 text-gray-500">...</span>}
                            </>
                        )}

                        {renderPageNumbers()}

                        {currentPage < totalPages - 2 && totalPages > 5 && (
                            <>
                                {currentPage < totalPages - 3 && <span className="px-2 py-1 text-gray-500">...</span>}
                                <button
                                    onClick={() => goToPage(totalPages)}
                                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-all text-sm font-bold uppercase tracking-wider"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
