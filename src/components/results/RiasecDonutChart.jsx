import { Box, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const RIASEC_CONFIG = [
	{ code: "R", name: "Realista", color: "#2563eb" },
	{ code: "I", name: "Investigador", color: "#14b8a6" },
	{ code: "A", name: "Artístico", color: "#f97316" },
	{ code: "S", name: "Social", color: "#22c55e" },
	{ code: "E", name: "Emprendedor", color: "#eab308" },
	{ code: "C", name: "Convencional", color: "#a855f7" },
];

function buildSegments(normalizedScores) {
	const rawSegments = RIASEC_CONFIG.map((profile) => ({
		...profile,
		value: Number(normalizedScores?.[profile.code] || 0),
	}));

	const total = rawSegments.reduce((acc, segment) => acc + segment.value, 0);

	if (total === 0) {
		return rawSegments.map((segment) => ({
			...segment,
			percentage: 0,
		}));
	}

	return rawSegments.map((segment) => ({
		...segment,
		percentage: Number(((segment.value / total) * 100).toFixed(1)),
	}));
}

export default function RiasecDonutChart({ normalizedScores, principalProfileName }) {
	const segments = buildSegments(normalizedScores);
	const chartData = segments.map((segment) => ({
		id: segment.code,
		value: segment.percentage,
		label: segment.name,
		color: segment.color,
	}));

	return (
		<Stack spacing={3}>
			<Box
				sx={{
					position: "relative",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<PieChart
					width={320}
					height={260}
					hideLegend
					series={[
						{
							data: chartData,
							innerRadius: 58,
							outerRadius: 108,
							paddingAngle: 4,
							cornerRadius: 6,
							startAngle: -45,
							endAngle: 315,
							cx: 160,
							cy: 130,
							sortingValues: "none",
						},
					]}
				/>

				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 110,
						height: 110,
						borderRadius: "50%",
						backgroundColor: "#ffffff",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						px: 1.5,
						pointerEvents: "none",
					}}
				>
					<Typography
						variant="h3"
						sx={{
							fontSize: "1rem",
							lineHeight: 1.2,
						}}
					>
						{principalProfileName}
					</Typography>
				</Box>
			</Box>

			<Stack spacing={1.25}>
				{segments.map((segment) => (
					<Box
						key={segment.code}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 2,
							p: 1.5,
							borderRadius: 2,
							backgroundColor: "#f8fbff",
							border: "1px solid #dbe2f0",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
							<Box
								sx={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									backgroundColor: segment.color,
									flexShrink: 0,
								}}
							/>
							<Typography variant="body2" sx={{ color: "#334155", fontWeight: 600 }}>
								{segment.name}
							</Typography>
						</Box>
						<Typography variant="body2" sx={{ color: "#475569" }}>
							{segment.percentage}%
						</Typography>
					</Box>
				))}
			</Stack>
		</Stack>
	);
}
