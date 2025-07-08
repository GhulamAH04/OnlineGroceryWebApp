import "chart.js/auto";
import dynamic from "next/dynamic";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

export default function ChartLine(props: {
  data: number[];
  labels: string[];
  title: string;
}) {
  const dataLine = {
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        data: props.data,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Line data={dataLine} />
    </div>
  );
}
