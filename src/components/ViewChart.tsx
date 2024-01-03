import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ViewChartProps = {
  data: {
    url: string;
    pageviews: number;
  }[];
};

const ViewChart = ({ data }: ViewChartProps) => {
  return (
    <ResponsiveContainer
      className="-ml-16"
      width="100%"
      height={data.length * 50}
    >
      <BarChart layout="vertical" data={data}>
        <YAxis
          type="category"
          dataKey="url"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={false}
        />
        <XAxis type="number" hide />
        <Tooltip
          wrapperStyle={{ maxWidth: "300px" }}
          // @ts-expect-error
          labelStyle={{ textWrap: "balance" }}
        />
        <Bar
          label={false}
          dataKey="pageviews"
          fill="#2c6e49"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="url"
            position="insideLeft"
            style={{ fill: "#000" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ViewChart;
