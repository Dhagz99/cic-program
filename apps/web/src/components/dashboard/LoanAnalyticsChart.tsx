// components/dashboard/LoanAnalyticsChart.tsx

"use client";

import {
   ResponsiveContainer,
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid,
   Legend,
} from "recharts";

type Props = {
   data: {
      month: string;
      borrowers: number;
      loans: number;
      amount: number;
   }[];
};

export default function LoanAnalyticsChart({
   data,
}: Props) {

   return (

      <div className="h-80">

         <ResponsiveContainer
            width="100%"
            height="100%"
         >

            <LineChart
               data={data}
            >

               <CartesianGrid
                  strokeDasharray="3 3"
               />

               <XAxis
                  dataKey="month"
               />

               <YAxis />

               <Tooltip />

               <Legend />

               <Line
                  type="monotone"
                  dataKey="borrowers"
                  stroke="#2563eb"
                  strokeWidth={3}
                  name="Borrowers"
               />

               <Line
                  type="monotone"
                  dataKey="loans"
                  stroke="#16a34a"
                  strokeWidth={3}
                  name="Loans"
               />

            </LineChart>

         </ResponsiveContainer>

      </div>

   );

}