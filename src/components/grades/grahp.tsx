'use client'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	LineElement,
	PointElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	LineElement,
	PointElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
)

type GradeProp = Record<string, number>

type GradesProps = {
	selectedYear: number
	years: number[]
	grades: Record<number, GradeProp>
}

type BarGraphProps = {
	grade: GradeProp
	totalCandidatesAlp: number
	totalCandidatesBin: number
	options: object
}

type LineGraphProps = {
	grades: Record<number, GradeProp>
	years: number[]
	selectedYear: number
	failRatioOptions: object
	avgGradeOptions: object
}

export default function Graphs({ grades, years, selectedYear }: GradesProps) {

	const totalCandidatesAlp = grades[selectedYear].A + grades[selectedYear].B + grades[selectedYear].C + grades[selectedYear].D + grades[selectedYear].E + grades[selectedYear].F
	const totalCandidatesBin = grades[selectedYear].G + grades[selectedYear].H

	const options = {
		responsive: true,
		plugins: {
			legend: {
				onClick: function(event:any, legendItem:any) {},
				labels: {
					boxWidth: 0,
				}
			},
			title: {
				display: false,
			}
		},
		scales: {
			x: {
				border: {
					display: false
				},
			  	grid: {
					display: false,
					drawOnChartArea: false, 
			  	},
			},
			y: {
				suggestedMin: 0,
				border: {
					display: false
				},
				grid: {
					display: false,
					drawOnChartArea: false, 
			  	},
			},
		}
	}

	const failRatioOptions = {
		...options,
		scales: {
			...options.scales,
			y: {
				...options.scales.y,
				grid: {
					color: 'rgb(60,60,60)',
					display: true,
					drawOnChartArea: true
				},
			},
		}
	}

	const avgGradeOptions = {
		...options,
		scales: {
			...options.scales,
			y: {
				...failRatioOptions.scales.y,
				ticks: {
					stepSize: 1,
					callback: function(value:number) {
						const letters = ['F', 'E', 'D', 'C', 'B', 'A']
						return letters[value]
					}
				},
			}
		}
	}
	
	return (
		<>
    		{ (totalCandidatesAlp !== 0 || totalCandidatesBin !== 0) && (

				<BarGraph 
					grade={grades[selectedYear]}
					totalCandidatesAlp={totalCandidatesAlp}
					totalCandidatesBin={totalCandidatesBin}
					options={options}
				/>
			
			)}

			<LineGraph 
				grades={grades}
				years={[...years].reverse()}
				selectedYear={selectedYear}
				avgGradeOptions={avgGradeOptions}
				failRatioOptions={failRatioOptions}
			/>
				
    	</>	
	)
}

function BarGraph({ grade, totalCandidatesAlp, totalCandidatesBin, options }: BarGraphProps) {

	  const data = {
		labels: ['A','B','C','D','E','F'],
		datasets: [
		  {
			label: 'Grades',
			data: [Math.round(grade.A/totalCandidatesAlp*100),Math.round(grade.B/totalCandidatesAlp*100),Math.round(grade.C/totalCandidatesAlp*100),Math.round(grade.D/totalCandidatesAlp*100),Math.round(grade.E/totalCandidatesAlp*100),Math.round(grade.F/totalCandidatesAlp*100)],
			backgroundColor: ['rgba(122, 189, 126, 0.5)','rgba(140, 212, 126, 0.5)','rgba(248, 214, 109, 0.5)','rgba(255, 181, 76, 0.5)','rgba(255, 105, 97, 0.5)','rgba(195, 57, 60, 0.5)'], 
		  },
		],
	  }

	  const dataBin = {
		labels: ['Pass','Fail'],
		datasets: [
		  {
			label: 'Grades',
			data: [Math.round(grade.G/totalCandidatesBin*100),Math.round(grade.H/totalCandidatesBin*100)],
			backgroundColor: ['rgba(122, 189, 126, 0.5)','rgba(255, 105, 97, 0.5)'],
		  },
		],
	}

	return (

		<>
			{ totalCandidatesAlp != 0 &&
				<Bar
					id='1'
					options={options}
					data={data}
				/>			
			}
			
			{ totalCandidatesBin != 0 && totalCandidatesAlp == 0 &&
				<Bar
					id='2'
					options={options}
					data={dataBin}
				/>
			}
		</>
	)
}

function LineGraph({ grades, years, selectedYear, failRatioOptions, avgGradeOptions }: LineGraphProps) {

	let totalCandidates = []
	for(let i=0; i < years.length; i++){
		const totalCandidatesAlp = grades[years[i]].A + grades[years[i]].B + grades[years[i]].C + grades[years[i]].D + grades[years[i]].E + grades[years[i]].F
		const totalCandidatesBin = grades[years[i]].G + grades[years[i]].H
		totalCandidates.push([totalCandidatesAlp,totalCandidatesBin])
	} 

	let failRatio = []
	for(let i=0; i < years.length; i++){
		if(totalCandidates[i][0]) 		failRatio.push(Math.round(grades[years[i]].F/totalCandidates[i][0]*100))
		else if(totalCandidates[i][1])	failRatio.push(Math.round(grades[years[i]].H/totalCandidates[i][1]*100))
		else 							failRatio.push(NaN)
	} 

	let avgGrade = []
	for(let i=0; i < years.length; i++){
		if(totalCandidates[i][0]) 	avgGrade.push((grades[years[i]].A*5+grades[years[i]].B*4+grades[years[i]].C*3+grades[years[i]].D*2+grades[years[i]].E*1+grades[years[i]].F*0)/totalCandidates[i][0])
		else 						avgGrade.push(NaN)
	} 

	const dataFailRatio = {
		labels: years,
		datasets: [
			{
				label: 'Fail percentage',
				data: failRatio,
				borderColor: 'rgba(255, 105, 97, 1)',
				backgroundColor: 'rgba(255, 105, 97, 1)',
				spanGaps: true,
				tension: 0.4,
				pointRadius: (context:any) => {
					const label = context.chart.data.labels[context.dataIndex]
					return label == selectedYear ? 9 : 5
				},
				pointBorderColor: (context:any) => {
					const label = context.chart.data.labels[context.dataIndex]
					return label == selectedYear ? "#181818" : "rgba(0,0,0,0)"
				},
				pointBorderWidth: 3
			},
		],
	}

	const dataAvgGrade = {
		labels: years,
		datasets: [
			{
				label: 'Average',
				data: avgGrade,
				borderColor: 'rgba(240, 134, 64, 1)',
				backgroundColor: 'rgba(240, 134, 64, 1)',
				spanGaps: true,
				tension: 0.4,
				pointRadius: (context:any) => {
					const label = context.chart.data.labels[context.dataIndex]
					return label == selectedYear ? 9 : 5
				},
				pointBorderColor: (context:any) => {
					const label = context.chart.data.labels[context.dataIndex]
					return label == selectedYear ? "#181818" : "rgba(0,0,0,0)"
				},
				pointBorderWidth: 3
			},
		],
	} 

	return (
		<>	
			<Line
				id='3'
				options={failRatioOptions}
				data={dataFailRatio}
			/>
	
			<Line
				id='4'
				options={avgGradeOptions}
				data={dataAvgGrade}
			/>			
		</>
	)
}