// frontend/src/components/Maps/StationMap.jsx

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Correction pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour gérer le clustering
const MarkerClusterGroup = ({ children }) => {
  const map = useMap();
  const clusterRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Créer le groupe de clustering
    clusterRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        // Déterminer la couleur du cluster en fonction du pire statut
        let color = '#38a169'; // Vert par défaut
        let hasWarning = false;
        let hasDanger = false;

        cluster.getAllChildMarkers().forEach((marker) => {
          const statusCode = marker.options.statusCode;
          if (statusCode === 2) hasDanger = true;
          if (statusCode === 1) hasWarning = true;
        });

        if (hasDanger) color = '#e53e3e';
        else if (hasWarning) color = '#dd6b20';

        return L.divIcon({
          html: `<div style="
            background-color: ${color};
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
        });
      },
    });

    map.addLayer(clusterRef.current);

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (clusterRef.current) {
      clusterRef.current.clearLayers();
      React.Children.forEach(children, (child) => {
        if (child && child.props && child.props.position) {
          const marker = L.marker(child.props.position, {
            statusCode: child.props.statusCode,
          });
          marker.bindPopup(child.props.popupContent);
          clusterRef.current.addLayer(marker);
        }
      });
    }
  }, [children]);

  return null;
};

// Composant principal de la carte
const StationMap = ({ stations, onStationClick, selectedStation }) => {
  const defaultCenter = [12.2383, -1.5616]; // Centre du Burkina
  const defaultZoom = 7;

  // Créer une icône personnalisée selon le statut
  const createStationIcon = (statusCode) => {
    const colors = {
      0: '#38a169', // Vert
      1: '#dd6b20', // Orange
      2: '#e53e3e', // Rouge
      3: '#a0aec0', // Gris
    };

    return L.divIcon({
      className: 'custom-station-icon',
      html: `<div style="
        background-color: ${colors[statusCode] || '#a0aec0'};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup>
          {stations.map((station) => (
            <Marker
              key={station.station_id}
              position={[station.latitude, station.longitude]}
              icon={createStationIcon(station.status_code)}
              statusCode={station.status_code}
              eventHandlers={{
                click: () => onStationClick(station.station_id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-anam-blue text-sm mb-1">
                    {station.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {station.station_id} ({station.station_type})
                  </p>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="font-semibold">Dernière réception :</span>{' '}
                      {station.last_data_received
                        ? new Date(station.last_data_received).toLocaleString('fr-FR', {
                            timeZone: 'UTC',
                          })
                        : 'Aucune donnée'}
                    </p>
                    {station.status_code === 0 && (
                      <p className="text-green-600 font-semibold">✓ Opérationnelle</p>
                    )}
                    {station.status_code === 1 && (
                      <p className="text-orange-500 font-semibold">⚠ Retard de transmission</p>
                    )}
                    {station.status_code === 2 && (
                      <p className="text-red-600 font-semibold">✗ Panne confirmée</p>
                    )}
                    {station.status_code === 3 && (
                      <p className="text-gray-500 font-semibold">⊘ Hors Service</p>
                    )}
                  </div>
                  <button
                    onClick={() => onStationClick(station.station_id)}
                    className="mt-2 w-full text-xs bg-anam-blue text-white py-1 px-2 rounded hover:bg-blue-800 transition-colors"
                  >
                    Voir la fiche station
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Légende flottante */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-xs font-bold text-gray-700 mb-2">Légende</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>OK (&lt; 1h)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Retard (&lt; 3h)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Panne (&gt; 3h)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Hors Service</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationMap;