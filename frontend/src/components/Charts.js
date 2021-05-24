
import React from "react";
import { AreaChart, Area, BarChart, 
  Bar, LineChart, Line, XAxis, 
  YAxis, CartesianGrid, Tooltip, PieChart,
   Pie, Cell, Legend, ResponsiveContainer } from "recharts";

export const InvestmentAreaChart = (props) => {
  const data = props.inputData;
  data.forEach(element => {
    element.TOTAL_AMOUNT = Math.abs(element.TOTAL_AMOUNT) > 999999 ? Math.sign(element.TOTAL_AMOUNT)*((Math.abs(element.TOTAL_AMOUNT)/1000000).toFixed(3)) : element.TOTAL_AMOUNT
  });
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="TRAN_DATE" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="TOTAL_AMOUNT" stroke="#0088FE" fill="#82ca9d" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const InvestorsPieChart = (props) => {
  const data = props.inputData;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#262b40", "#dc30fb", "#00fdf2"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };
  return (
    <ResponsiveContainer width='100%' height={280}>
    <PieChart align="center">
      <Legend verticalAlign="top" align="left" layout="vertical"/>
      <Pie
        data={data}
        cx='45%'
        cy={110}
        labelLine={false}
        label={renderCustomizedLabel}
        isAnimationActive={false}
        outerRadius={100}
        fill="#8884d8"
        nameKey="INVESTOR"
        dataKey="TOTAL_AMOUNT"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
    </ResponsiveContainer>
  );
}

export const TtlAmtByMthAreaChart = (props) => {
  const data = props.inputData;
  data.forEach(element => element.TOTAL_AMOUNT = _mFormal(element.TOTAL_AMOUNT));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="TRAN_MONTH" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="TOTAL_AMOUNT" stroke="#0088FE" fill="#82ca9d" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const TtlAmtByYrsAreaChart = (props) => {
  const data = props.inputData;
  data.forEach(element => {
    element.TOTAL_AMOUNT = _mFormal(element.TOTAL_AMOUNT)
  });
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="TRAN_YEAR" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="TOTAL_AMOUNT" stroke="#8884d8" fill="#24f7f7" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const TopInvestorsBarChart = (props) => {
  const data = props.inputData;
  data.forEach(element => {
    element.TOTAL_AMOUNT = _mFormal(element.TOTAL_AMOUNT)
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="INVESTOR" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="TOTAL_AMOUNT" fill="#FFBB28" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const TopCompanyBarChart = (props) => {
  const data = props.inputData;
  data.forEach(element => {
    element.TOTAL_AMOUNT = _mFormal(element.TOTAL_AMOUNT)
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="INVESTEE" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="TOTAL_AMOUNT" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const CountriesLineChart = (props) => {
  const data = props.inputData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="TRAN_YEAR" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="United States" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="China" stroke="#FF8042" />
        <Line type="monotone" dataKey="Japan" stroke="#0088FE" />
        <Line type="monotone" dataKey="Germany" stroke="#00C49F" />
        <Line type="monotone" dataKey="Sweden" stroke="#FFBB28" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const CountriesChart = (props) => {
  const data = props.inputData;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#262b40"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };
  return (
    <ResponsiveContainer width='100%' height={200}>
    <PieChart align="center">
      <Legend verticalAlign="top" align="left" layout="vertical"/>
      <Pie
        data={data}
        cx='40%'
        cy={100}
        labelLine={false}
        label={renderCustomizedLabel}
        isAnimationActive={false}
        outerRadius={80}
        fill="#8884d8"
        nameKey="COUNTRY"
        dataKey="TOTAL_AMOUNT"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
    </ResponsiveContainer>
  );
}

const _mFormal = (num) => {
  num = num > 999999 ? 
    Math.sign(num)*((Math.abs(num)/1000000).toFixed(3)) :
    num;
    return num;
};