import "chart.js/auto";
import dynamic from "next/dynamic";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
export default function ChartBar(props: {
  data: number[];
  labels: string[];
  title: string;
}) {
  const dataBar = {
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        data: props.data,
        fill: false,
        height: 100,
        tension: 0.1,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={dataBar} />
    </div>
  );
}
