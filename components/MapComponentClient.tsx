"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useRef } from "react";

type MapComponentClientProps = {
  products: any[];
  userLocation: { lat: number; lng: number } | null;
};

// Генерация иконки для магазина
function getStoreIcon(storeId: string, productCount: number): L.DivIcon {
  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
  const idx = parseInt(storeId, 10) % colors.length;
  const color = colors[idx];
  const size = Math.max(24, Math.min(40, 20 + productCount * 2));

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">${productCount}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// Генерация иконки для пользователя
function getUserIcon(): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        background-color: #3498db;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
      ">📍</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function MapComponentClient({
  products,
  userLocation,
}: MapComponentClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Инициализация карты
  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем карту только один раз
    if (!mapRef.current) {
      const center = userLocation || { lat: 41.2995, lng: 69.2401 };
      const map = L.map(containerRef.current).setView([center.lat, center.lng], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
    }
  }, [userLocation]);

  // Отрисовка маркеров при изменении товаров или локации
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Очистка старых маркеров
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Группируем продукты по магазинам
    const storeMap = new Map<string, { store: any; products: any[] }>();
    products.forEach((product) => {
      const storeId = product.store.id;
      if (!storeMap.has(storeId)) {
        storeMap.set(storeId, { store: product.store, products: [] });
      }
      storeMap.get(storeId)!.products.push(product);
    });

    // Добавляем маркеры для магазинов
    storeMap.forEach(({ store, products: storeProducts }) => {
      const marker = L.marker(
        [store.coordinates.lat, store.coordinates.lng],
        { icon: getStoreIcon(store.id, storeProducts.length) }
      ).addTo(map);

      const popupHtml = `
        <div style="min-width: 200px; font-family: sans-serif;">
          <h3 style="margin:0 0 4px; font-size:14px;">${store.name}</h3>
          <p style="margin:0 0 8px; font-size:12px; color:#555;">${store.address}</p>
          <div style="font-size:12px;">
            Товаров: <strong>${storeProducts.length}</strong><br/>
            Рейтинг: <strong>${store.rating}</strong>
          </div>
        </div>`;
      marker.bindPopup(popupHtml);
      markersRef.current.push(marker);
    });

    // Добавляем маркер пользователя
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: getUserIcon(),
      }).addTo(map);

      userMarker.bindPopup("<b>Вы здесь</b>");
      markersRef.current.push(userMarker);
    }
  }, [products, userLocation]);

  return (
    <div
      ref={containerRef}
      style={{
        height: 500,
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    />
  );
}
