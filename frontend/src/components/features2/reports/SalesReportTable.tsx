"use client";
import { useEffect, useState } from "react";
import { SalesByCategory, SalesSummary, SalesByProduct } from "@/interfaces";

export default function SalesReportTable({
  storeId,
  month,
}: {
  storeId: string;
  month: string;
}) {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [categoryReport, setCategoryReport] = useState<SalesByCategory[]>([]);
  const [productReport, setProductReport] = useState<SalesByProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    let url = "http://localhost:3002/reports/sales?";
    if (storeId) url += `storeId=${storeId}&`;
    if (month) url += `month=${month}&`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.data?.summary || null);
        setCategoryReport(data.data?.byCategory || []);
        setProductReport(data.data?.byProduct || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [storeId, month]);

  if (loading) return <p>Loading report...</p>;
  if (!summary)
    return <p className="text-center">Tidak ada data laporan penjualan.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Ringkasan Penjualan Bulan Ini</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded text-center">
          <div className="text-lg font-semibold">Total Penjualan</div>
          <div className="text-2xl font-bold">
            Rp{summary.totalSales.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded text-center">
          <div className="text-lg font-semibold">Transaksi</div>
          <div className="text-2xl font-bold">{summary.totalTransaction}</div>
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2">Penjualan per Kategori</h3>
      <table className="min-w-full mb-6 bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 border">Kategori</th>
            <th className="p-2 border">Penjualan</th>
          </tr>
        </thead>
        <tbody>
          {categoryReport.map((cat) => (
            <tr key={cat.category}>
              <td className="p-2 border">{cat.category}</td>
              <td className="p-2 border">Rp{cat.sales.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-bold mb-2">Penjualan per Produk</h3>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 border">Produk</th>
            <th className="p-2 border">Penjualan</th>
          </tr>
        </thead>
        <tbody>
          {productReport.map((prod) => (
            <tr key={prod.product}>
              <td className="p-2 border">{prod.product}</td>
              <td className="p-2 border">Rp{prod.sales.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
