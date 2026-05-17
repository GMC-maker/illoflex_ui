import { Box, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const RIASEC_CONFIG = [
	{ code: "R", name: "Realista", color: "#2563eb" },
	{ code: "I", name: "Investigador", color: "#14b8a6" },
	{ code: "A", name: "Artístico", color: "#f97316" },
	{ code: "S", name: "Social", color: "#22c55e" },
	{ code: "E", name: "Emprendedor", color: "#eab308" },
	{ code: "C", name: "Convencional", color: "#a855f7" },
];

function buildSegments(normalizedScores) {
	return RIASEC_CONFIG.map((profile) => {
		const normalizedValue = Number(normalizedScores?.[profile.code] || 0);

		return {
			...profile,
			normalizedValue,
			percentage: Number((normalizedValue * 100).toFixed(1)),
		};
	});
}

export default function RiasecPerfilChart({
	normalizedScores,
	principalProfileName,
}) {
	const segments = buildSegments(normalizedScores);
	const chartValues = segments.map((segment) => segment.percentage);
	const chartLabels = segments.map((segment) => segment.code);

	return (
		<Stack spacing={3}>
			<Box
				sx={{
					p: { xs: 2, md: 3 },
					borderRadius: 3,
					background:
						"linear-gradient(180deg, #fbfdff 0%, #f8fbff 100%)",
					border: "1px solid #e2e8f0",
				}}>
				<LineChart
					height={280}
					xAxis={[
						{
							scaleType: "point",
							data: chartLabels,
						},
					]}
					yAxis={[
						{
							min: 0,
							max: 100,
						},
					]}
					series={[
						{
							data: chartValues,
							color: "#315efb",
							curve: "monotoneX",
							showMark: true,
							label: principalProfileName,
						},
					]}
					margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
					grid={{ horizontal: true }}
					slotProps={{
						legend: {
							hidden: true,
						},
					}}
					sx={{
						"& .MuiLineElement-root": {
							strokeWidth: 5,
						},
						"& .MuiMarkElement-root": {
							strokeWidth: 4,
							r: 8,
						},
					}}
				/>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
					gap: 1.25,
				}}>
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
						}}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.25,
							}}>
							<Box
								sx={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									backgroundColor: segment.color,
									flexShrink: 0,
								}}
							/>
							<Typography
								variant='body2'
								sx={{ color: "#334155", fontWeight: 600 }}>
								{segment.name}
							</Typography>
						</Box>
						<Typography variant='body2' sx={{ color: "#475569" }}>
							{segment.percentage}%
						</Typography>
					</Box>
				))}
			</Box>
		</Stack>
	);
}
