import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    Area,
    AreaChart
} from "recharts";

const COLORS = {
    Appreciation: "#22c55e",
    Concerns: "#ef4444",
    Suggestions: "#FF6B00",
};

// Professional gradient definitions
const GRADIENTS = {
    Appreciation: { start: "#22c55e", end: "#16a34a" },
    Concerns: { start: "#ef4444", end: "#dc2626" },
    Suggestions: { start: "#FF6B00", end: "#ea580c" },
};

// Custom tooltip with professional styling
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-2xl">
                <p className="text-white font-bold text-sm mb-2 uppercase tracking-wider">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-300 text-xs font-mono">
                            {entry.name}: <span className="text-white font-bold">{entry.value}</span>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsCharts({ analytics, results }) {
    // Prepare sentiment breakdown data
    const sentimentData = [
        { name: "Appreciation", value: analytics?.Appreciation || 0, color: COLORS.Appreciation },
        { name: "Concerns", value: analytics?.Concerns || 0, color: COLORS.Concerns },
        { name: "Suggestions", value: analytics?.Suggestions || 0, color: COLORS.Suggestions },
    ];

    // Branch Data
    const branchData = analytics?.branchData && analytics.branchData.length > 0
        ? analytics.branchData
        : [{ branch: "No Data", Appreciation: 0, Concerns: 0, Suggestions: 0 }];

    // Type Data
    const typeData = analytics?.typeData && analytics.typeData.length > 0
        ? analytics.typeData
        : [{ type: "No Data", Appreciation: 0, Concerns: 0, Suggestions: 0 }];

    // Trend Data
    const trendData = analytics?.trendData && analytics.trendData.length > 0
        ? analytics.trendData
        : [{ date: "No Data", Appreciation: 0, Concerns: 0, Suggestions: 0 }];

    return (
        <div className="w-full space-y-8">
            {/* Overall Sentiment Bar Chart with Gradient */}
            <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-transparent border-t-2 border-t-cyber-orange shadow-xl">
                <div className="mb-6">
                    <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-cyber-orange to-orange-600 rounded-full inline-block shadow-lg"></span>
                        Overall Sentiment Breakdown
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 ml-6 font-mono">Total responses analyzed: {analytics?.Total || 0}</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={sentimentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                            <linearGradient id="gradAppreciation" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENTS.Appreciation.start} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={GRADIENTS.Appreciation.end} stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="gradConcerns" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENTS.Concerns.start} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={GRADIENTS.Concerns.end} stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="gradSuggestions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENTS.Suggestions.start} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={GRADIENTS.Suggestions.end} stopOpacity={0.7} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" stroke="#ffffff15" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            tick={{ fill: '#d1d5db', fontSize: 12, fontWeight: 600 }}
                            axisLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#d1d5db', fontSize: 12 }}
                            axisLine={{ stroke: '#4b5563' }}
                            label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                        <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={80}>
                            {sentimentData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#grad${entry.name})`}
                                    className="drop-shadow-lg"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Branch-wise Distribution with Enhanced Design */}
            <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-transparent border-t-2 border-t-green-500/50 shadow-xl">
                <div className="mb-6">
                    <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-green-700 rounded-full inline-block shadow-lg"></span>
                        Branch-wise Sentiment Distribution
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 ml-6 font-mono">Comparative analysis across departments</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="5 5" stroke="#ffffff15" vertical={false} />
                        <XAxis
                            dataKey="branch"
                            stroke="#9ca3af"
                            tick={{ fill: '#d1d5db', fontSize: 12, fontWeight: 600 }}
                            axisLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#d1d5db', fontSize: 12 }}
                            axisLine={{ stroke: '#4b5563' }}
                            label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                            formatter={(value) => <span className="text-gray-300 text-sm font-semibold">{value}</span>}
                        />
                        <Bar dataKey="Appreciation" fill={COLORS.Appreciation} radius={[6, 6, 0, 0]} maxBarSize={50} />
                        <Bar dataKey="Concerns" fill={COLORS.Concerns} radius={[6, 6, 0, 0]} maxBarSize={50} />
                        <Bar dataKey="Suggestions" fill={COLORS.Suggestions} radius={[6, 6, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feedback Type Distribution */}
                <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-transparent border-t-2 border-t-blue-500/50 shadow-xl">
                    <div className="mb-6">
                        <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full inline-block shadow-lg"></span>
                            Type-wise Distribution
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 ml-6 font-mono">Feedback categorization</p>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={typeData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="5 5" stroke="#ffffff15" horizontal={false} />
                            <XAxis
                                type="number"
                                stroke="#9ca3af"
                                tick={{ fill: '#d1d5db', fontSize: 11 }}
                                axisLine={{ stroke: '#4b5563' }}
                            />
                            <YAxis
                                dataKey="type"
                                type="category"
                                stroke="#9ca3af"
                                width={100}
                                tick={{ fill: '#d1d5db', fontSize: 11, fontWeight: 600 }}
                                axisLine={{ stroke: '#4b5563' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                            <Legend
                                iconType="circle"
                                formatter={(value) => <span className="text-gray-300 text-xs font-semibold">{value}</span>}
                            />
                            <Bar dataKey="Appreciation" fill={COLORS.Appreciation} radius={[0, 8, 8, 0]} />
                            <Bar dataKey="Concerns" fill={COLORS.Concerns} radius={[0, 8, 8, 0]} />
                            <Bar dataKey="Suggestions" fill={COLORS.Suggestions} radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Trend Chart with Area */}
                <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-transparent border-t-2 border-t-purple-500/50 shadow-xl">
                    <div className="mb-6">
                        <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full inline-block shadow-lg"></span>
                            7-Day Trend Analysis
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 ml-6 font-mono">Historical sentiment patterns</p>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorAppreciation" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.Appreciation} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.Appreciation} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorConcerns" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.Concerns} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.Concerns} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSuggestions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.Suggestions} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.Suggestions} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" stroke="#ffffff15" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={{ fill: '#d1d5db', fontSize: 11 }}
                                axisLine={{ stroke: '#4b5563' }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#d1d5db', fontSize: 11 }}
                                axisLine={{ stroke: '#4b5563' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ paddingTop: '10px' }}
                                iconType="circle"
                                formatter={(value) => <span className="text-gray-300 text-xs font-semibold">{value}</span>}
                            />
                            <Area
                                type="monotone"
                                dataKey="Appreciation"
                                stroke={COLORS.Appreciation}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAppreciation)"
                                dot={{ fill: COLORS.Appreciation, r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Concerns"
                                stroke={COLORS.Concerns}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorConcerns)"
                                dot={{ fill: COLORS.Concerns, r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Suggestions"
                                stroke={COLORS.Suggestions}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorSuggestions)"
                                dot={{ fill: COLORS.Suggestions, r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Enhanced Summary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 text-center border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/10 to-transparent hover:from-green-500/20 transition-all shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Appreciation Rate</p>
                    </div>
                    <p className="text-4xl font-black text-green-400 mb-1">
                        {analytics?.Total > 0
                            ? Math.round((analytics.Appreciation / analytics.Total) * 100)
                            : 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{analytics?.Appreciation || 0} responses</p>
                </div>
                <div className="glass-card p-6 text-center border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/10 to-transparent hover:from-red-500/20 transition-all shadow-lg hover:shadow-red-500/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Concerns Rate</p>
                    </div>
                    <p className="text-4xl font-black text-red-400 mb-1">
                        {analytics?.Total > 0
                            ? Math.round((analytics.Concerns / analytics.Total) * 100)
                            : 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{analytics?.Concerns || 0} responses</p>
                </div>
                <div className="glass-card p-6 text-center border-l-4 border-l-cyber-orange bg-gradient-to-br from-orange-500/10 to-transparent hover:from-orange-500/20 transition-all shadow-lg hover:shadow-orange-500/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-orange animate-pulse"></div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Suggestions Rate</p>
                    </div>
                    <p className="text-4xl font-black text-cyber-orange mb-1">
                        {analytics?.Total > 0
                            ? Math.round((analytics.Suggestions / analytics.Total) * 100)
                            : 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{analytics?.Suggestions || 0} responses</p>
                </div>
                <div className="glass-card p-6 text-center border-l-4 border-l-white bg-gradient-to-br from-white/10 to-transparent hover:from-white/20 transition-all shadow-lg hover:shadow-white/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Total Responses</p>
                    </div>
                    <p className="text-4xl font-black text-white mb-1">{analytics?.Total || 0}</p>
                    <p className="text-xs text-gray-500 font-mono">All feedback</p>
                </div>
            </div>
        </div>
    );
}
