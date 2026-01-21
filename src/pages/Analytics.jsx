import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import '../styles/Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedAdBox, setSelectedAdBox] = useState('all');
  const [selectedAd, setSelectedAd] = useState('all');

  // Dummy data for impressions chart
  const impressionsData = {
    labels: ['Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12'],
    datasets: [
      {
        label: 'Impressions',
        data: [1200, 1900, 1500, 2200, 1800, 2400, 2100],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Demographics pie chart data
  const demographicsData = {
    labels: ['18-24 years', '25-34 years', '35-44 years', '45-54 years', '55+ years'],
    datasets: [
      {
        data: [25, 35, 20, 12, 8],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgb(102, 126, 234)',
          'rgb(118, 75, 162)',
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Top performing ads bar chart
  const topAdsData = {
    labels: ['Summer Sale', 'Winter Collection', 'New Arrivals', 'Clearance', 'Flash Deal'],
    datasets: [
      {
        label: 'Impressions',
        data: [4500, 3800, 3200, 2900, 2400],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 2,
      },
    ],
  };

  // Location performance data
  const locationData = [
    { location: 'Mall Road, Kochi', impressions: 5200, clicks: 420, engagement: '8.1%' },
    { location: 'MG Road, Bangalore', impressions: 4800, clicks: 384, engagement: '8.0%' },
    { location: 'Park Street, Kolkata', impressions: 3900, clicks: 273, engagement: '7.0%' },
    { location: 'Connaught Place, Delhi', impressions: 3500, clicks: 245, engagement: '7.0%' },
    { location: 'Marine Drive, Mumbai', impressions: 3200, clicks: 224, engagement: '7.0%' },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Location,Impressions,Clicks,Engagement\n"
      + locationData.map(row => `${row.location},${row.impressions},${row.clicks},${row.engagement}`).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    alert('PDF export functionality will be implemented with a library like jsPDF');
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="page-subtitle">Track performance and insights</p>
        </div>
        <div className="export-buttons">
          <button className="export-btn csv" onClick={handleExportCSV}>
            📄 Export CSV
          </button>
          <button className="export-btn pdf" onClick={handleExportPDF}>
            📑 Export PDF
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="analytics-scroll">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ad Box Location</label>
            <select value={selectedAdBox} onChange={(e) => setSelectedAdBox(e.target.value)}>
              <option value="all">All Locations</option>
              <option value="kochi">Mall Road, Kochi</option>
              <option value="bangalore">MG Road, Bangalore</option>
              <option value="kolkata">Park Street, Kolkata</option>
              <option value="delhi">Connaught Place, Delhi</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Specific Ad</label>
            <select value={selectedAd} onChange={(e) => setSelectedAd(e.target.value)}>
              <option value="all">All Ads</option>
              <option value="ad1">Summer Sale Campaign</option>
              <option value="ad2">Winter Collection</option>
              <option value="ad3">New Arrivals</option>
              <option value="ad4">Flash Deal</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">👁️</div>
            <div className="summary-info">
              <h3>Total Impressions</h3>
              <p className="summary-number">24,567</p>
              <span className="summary-change positive">+15.3% from last period</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🖱️</div>
            <div className="summary-info">
              <h3>Total Clicks</h3>
              <p className="summary-number">1,823</p>
              <span className="summary-change positive">+12.8% from last period</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-info">
              <h3>Engagement Rate</h3>
              <p className="summary-number">7.4%</p>
              <span className="summary-change positive">+0.5% from last period</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-info">
              <h3>Revenue Generated</h3>
              <p className="summary-number">₹45,230</p>
              <span className="summary-change positive">+18.2% from last period</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Impressions Line Chart */}
          <div className="chart-container large">
            <h3>Impressions Trend</h3>
            <p className="chart-subtitle">Daily impressions over selected period</p>
            <div className="chart-wrapper">
              <Line data={impressionsData} options={chartOptions} />
            </div>
          </div>

          {/* Demographics Pie Chart */}
          <div className="chart-container small">
            <h3>Demographics</h3>
            <p className="chart-subtitle">Age distribution of viewers</p>
            <div className="chart-wrapper">
              <Pie data={demographicsData} options={chartOptions} />
            </div>
          </div>

          {/* Top Performing Ads Bar Chart */}
          <div className="chart-container full">
            <h3>Top Performing Ads</h3>
            <p className="chart-subtitle">Ads with highest impressions</p>
            <div className="chart-wrapper">
              <Bar data={topAdsData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Location Performance Table */}
        <div className="location-performance">
          <h3>Performance by Location</h3>
          <div className="table-container">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {locationData.map((location, index) => (
                  <tr key={index}>
                    <td>
                      <div className="location-cell">
                        <span className="location-icon">📍</span>
                        {location.location}
                      </div>
                    </td>
                    <td>{location.impressions.toLocaleString()}</td>
                    <td>{location.clicks.toLocaleString()}</td>
                    <td>
                      <span className="engagement-badge">{location.engagement}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
