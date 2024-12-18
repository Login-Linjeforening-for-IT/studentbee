type GradeProp = Record<string, number>

type GradesProps = {
	sYear: number
	grades: Record<number, GradeProp>
}

type BarGraphProps = {
	grade: GradeProp
	totalCandidatesAlp: number
	totalCandidatesBin: number
}

export default function Graphs({ grades, sYear }: GradesProps) {

		const totalCandidatesAlp = grades[sYear].A + grades[sYear].B + grades[sYear].C + grades[sYear].D + grades[sYear].F
		const totalCandidatesBin = grades[sYear].G + grades[sYear].H
		
		return (
			<div className="">
				{(totalCandidatesAlp !=0 || totalCandidatesBin !=0) && 
				<BarGraph grade={
					grades[sYear]}
					totalCandidatesAlp={totalCandidatesAlp}
					totalCandidatesBin={totalCandidatesBin} />}
			</div>
		)
		
}

function BarGraph({ grade, totalCandidatesAlp, totalCandidatesBin }: BarGraphProps) {
	const gradeAlpData = [
		{ label: "A", value: grade.A, color: "rgba(122, 189, 126, 0.5)" },
		{ label: "B", value: grade.B, color: "rgba(140, 212, 126, 0.5)" },
		{ label: "C", value: grade.C, color: "rgba(248, 214, 109, 0.5)" },
		{ label: "D", value: grade.D, color: "rgba(255, 181, 76, 0.5)" },
		{ label: "F", value: grade.F, color: "rgba(255, 105, 97, 0.5)" },
	]

	const gradeBinData = [
		{ label: "Pass", value: grade.G, color: "rgba(122, 189, 126, 0.5)"  },
		{ label: "Fail", value: grade.H, color: "rgba(255, 105, 97, 0.5)" },
	]

	// Maximum value for scaling
	const maxValueAlp = Math.max(...gradeAlpData.map((data) => data.value))
	const maxValueBin = Math.max(...gradeBinData.map((data) => data.value))

		

	return (
		<div className="w-full mt-20 flex justify-between space-x-10">
			{/* Alpabet Grades */}
			<div className="flex justify-between space-x-4">
				{totalCandidatesAlp != 0 &&
					gradeAlpData.map((data) => {
						const barHeight = (data.value / maxValueAlp) * 250
						const textPos = barHeight < 24?"mt-[-30px]":""
						return (
							<div key={data.label} className="flex flex-col items-center">
								<div
									className="w-16"
									style={{
										height: `${barHeight}px`,
										backgroundColor: data.color,
										marginTop: `${250 - barHeight}px`,
									}}
								>
									<p className={`text-center ${textPos}`}>
										{Math.round((data.value / totalCandidatesAlp) * 100)}
									</p>
								</div>
								<div className="mt-2 text-sm">{data.label}</div>
							</div>
						)
					})
				}
			</div>
			
			{/* Binary Grades / Pass Fail */}
			<div className="flex justify-between space-x-4">
				{totalCandidatesBin != 0 &&
					gradeBinData.map((data) => {
						const barHeight = (data.value / maxValueBin) * 250
						const textPos = barHeight < 24?"mt-[-30px]":""
						return (
							<div key={data.label} className="flex flex-col items-center">
								<div
									className="w-16"
									style={{
										height: `${barHeight}px`,
										backgroundColor: data.color, 
										marginTop: `${250 - barHeight}px`,
									}}
								>
									<p className={`text-center ${textPos}`}>
										{Math.round((data.value / totalCandidatesBin) * 100)}
									</p>
								</div>
								<div className="mt-2 text-sm">{data.label}</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}