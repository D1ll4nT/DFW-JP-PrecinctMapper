import { Precinct } from "@shared/schema";

export const countyColors: Record<string, string> = {
  'Collin County': '#3b82f6',
  'Dallas County': '#10b981', 
  'Denton County': '#f59e0b',
  'Tarrant County': '#8b5cf6'
};

export function getPrecinctColor(county: string): string {
  return countyColors[county] || '#6b7280';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(Math.round(num));
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatPercentage(num: number): string {
  return (num * 100).toFixed(1) + '%';
}

// Simple point-in-polygon check
export function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}
