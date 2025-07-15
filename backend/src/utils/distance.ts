// FILE: backend/src/utils/distance.ts

/**
 * @fileoverview Utilitas untuk kalkulasi geografis, khususnya jarak Haversine.
 */

/**
 * Menghitung jarak antara dua titik koordinat geografis menggunakan formula Haversine.
 * @param lat1 - Latitude titik pertama.
 * @param lon1 - Longitude titik pertama.
 * @param lat2 - Latitude titik kedua.
 * @param lon2 - Longitude titik kedua.
 * @returns {number} Jarak dalam kilometer.
 */
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Jarak dalam km
};
