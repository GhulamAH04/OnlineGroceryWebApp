"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  SalesReportItem,
  StockReportItem,
  StockMutationItem,
  Branch,
} from "@/interfaces/reportSales.interface";

const COLORS = ["#22c55e", "#16a34a", "#15803d", "#166534"];

export default function ReportsPage() {
  // === STATE ===
  const [salesByMonth, setSalesByMonth] = useState<SalesReportItem[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<SalesReportItem[]>([]);
  const [salesByProduct, setSalesByProduct] = useState<SalesReportItem[]>([]);
  const [stockReport, setStockReport] = useState<StockReportItem[]>([]);
  const [stockMutations, setStockMutations] = useState<StockMutationItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("2025-07");

  // === FETCH BRANCH LIST ===
  const fetchBranches = async () => {
    try {
      const res = await axios.get("/api/admin/branches");
      setBranches(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      toast.error("Gagal mengambil data cabang");
    }
  };

  // === FETCH SALES & STOCK SUMMARY REPORT ===
  const fetchReports = async (branchId?: number) => {
    try {
      const [month, category, product, stock] = await Promise.all([
        axios.get("/api/admin/reports/sales/month", { params: { branchId } }),
        axios.get("/api/admin/reports/sales/category", {
          params: { branchId },
        }),
        axios.get("/api/admin/reports/sales/product", { params: { branchId } }),
        axios.get("/api/admin/reports/stock/summary", { params: { branchId } }),
      ]);

      setSalesByMonth(Array.isArray(month.data?.data) ? month.data.data : []);
      setSalesByCategory(
        Array.isArray(category.data?.data) ? category.data.data : []
      );
      setSalesByProduct(
        Array.isArray(product.data?.data) ? product.data.data : []
      );
      setStockReport(Array.isArray(stock.data?.data) ? stock.data.data : []);
    } catch {
      toast.error("Gagal mengambil data laporan");
    }
  };

  // === FETCH DETAIL MUTASI STOK ===
  const fetchMutations = async () => {
    try {
      const res = await axios.get("/api/admin/reports/stock/detail", {
        params: {
          branchId: selectedBranchId,
          month: selectedMonth,
        },
      });
      setStockMutations(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error?.response?.data?.message || "Gagal mengambil detail mutasi stok"
      );
    }
  };

  // === ON LOAD: Fetch Cabang
  useEffect(() => {
    fetchBranches();
  }, []);

  // === ON FILTER CHANGE
  useEffect(() => {
    fetchReports(selectedBranchId ?? undefined);
    fetchMutations();
  }, [selectedBranchId, selectedMonth]);

  return (
    <div className="min-h-screen p-4 bg-gray-50 space-y-8">
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Laporan & Analisis
      </h1>

      {/* === FILTER: Cabang dan Bulan === */}
      <div className="max-w-md mx-auto mb-4 flex flex-col gap-2">
        <select
          value={selectedBranchId ?? ""}
          onChange={(e) =>
            setSelectedBranchId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border rounded p-2"
        >
          <option value="">Semua Cabang</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* === PENJUALAN PER BULAN === */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Penjualan per Bulan
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByMonth}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSales" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* === PENJUALAN KATEGORI & PRODUK === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Penjualan per Kategori
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategory}
                dataKey="totalSales"
                nameKey="label"
                outerRadius={100}
                label
              >
                {salesByCategory.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Penjualan per Produk
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByProduct}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === RINGKASAN MUTASI STOK === */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Ringkasan Mutasi Stok
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockReport}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalIn" fill="#16a34a" name="IN" />
            <Bar dataKey="totalOut" fill="#f87171" name="OUT" />
            <Bar dataKey="endingStock" fill="#15803d" name="Sisa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* === TABEL DETAIL MUTASI === */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Detail Mutasi Stok per Produk
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Produk</th>
                <th className="p-2 border">Tipe</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Cabang</th>
                <th className="p-2 border">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {stockMutations.length > 0 ? (
                stockMutations.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item.date}</td>
                    <td className="p-2 border">{item.product}</td>
                    <td className="p-2 border">{item.action}</td>
                    <td className="p-2 border">{item.amount}</td>
                    <td className="p-2 border">{item.branch}</td>
                    <td className="p-2 border">{item.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Tidak ada data mutasi stok untuk bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
