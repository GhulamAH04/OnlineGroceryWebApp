import 'chart.js/auto';
import dynamic from 'next/dynamic';

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Doughnut),
  {
    ssr: false,
  },
);

export default function ChartPie(props: {
  data: number[];
  labels: string[];
  title: string;
}) {
  const dataDoughnut = {
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        data: props.data,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-md text-center font-bold">{props.title}</h2>
      <Doughnut data={dataDoughnut} />
    </div>
  );
}
