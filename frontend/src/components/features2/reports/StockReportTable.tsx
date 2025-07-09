"use client";
import { useEffect, useState } from "react";
import { StockDetail, StockSummary } from "@/interfaces";

export default function StockReportTable({
  storeId,
  month,
}: {
  storeId: string;
  month: string;
}) {
  const [summary, setSummary] = useState<StockSummary[]>([]);
  const [details, setDetails] = useState<Record<string, StockDetail[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    let url = "http://localhost:3002/reports/stock?";
    if (storeId) url += `storeId=${storeId}&`;
    if (month) url += `month=${month}&`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.data?.summary || []);
        setDetails(data.data?.details || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [storeId, month]);

  if (loading) return <p>Loading report...</p>;
  if (!summary.length)
    return <p className="text-center">Tidak ada data laporan stok.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">
        Ringkasan Laporan Stok Bulan Ini
      </h2>
      <table className="min-w-full mb-6 bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 border">Produk</th>
            <th className="p-2 border">Total Masuk</th>
            <th className="p-2 border">Total Keluar</th>
            <th className="p-2 border">Stok Akhir</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.product}>
              <td className="p-2 border">{row.product}</td>
              <td className="p-2 border">{row.totalIn}</td>
              <td className="p-2 border">{row.totalOut}</td>
              <td className="p-2 border">{row.finalStock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail per produk */}
      <h3 className="text-lg font-bold mb-2">
        Detail Perubahan Stok (Per Produk)
      </h3>
      {Object.keys(details).length === 0 && (
        <p className="text-center">Tidak ada detail stok.</p>
      )}
      {Object.entries(details).map(([product, dets]) => (
        <div key={product} className="mb-8">
          <h4 className="font-semibold">{product}</h4>
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Aksi</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {dets.map((d, i) => (
                <tr key={i}>
                  <td className="p-2 border">
                    {new Date(d.date).toLocaleString()}
                  </td>
                  <td className="p-2 border">{d.action}</td>
                  <td className="p-2 border">{d.amount}</td>
                  <td className="p-2 border">{d.note ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
