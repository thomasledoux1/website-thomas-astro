import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ViewChartProps = {
  data: [date: string, pageViewNumber: number][];
};

const ViewChart = ({ data }: ViewChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        width={500}
        height={400}
        data={data.map((el) => ({
          ...el,
          day: new Date(el[0]).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          page_views_count: +el[1],
        }))}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="page_views_count"
          stroke="#2c6e49"
          fill="#2c6e49"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ViewChart;
