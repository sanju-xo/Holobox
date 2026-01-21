import React, { useState } from 'react';
import '../styles/Scheduling.css';

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'
  const [selectedAdBox, setSelectedAdBox] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Mock data for ad boxes
  const adBoxes = [
    { id: 1, name: 'Mall Road, Kochi', status: 'online' },
    { id: 2, name: 'MG Road, Bangalore', status: 'online' },
    { id: 3, name: 'Park Street, Kolkata', status: 'online' },
    { id: 4, name: 'Connaught Place, Delhi', status: 'offline' },
    { id: 5, name: 'Marine Drive, Mumbai', status: 'online' },
  ];

  // Mock data for available ads
  const availableAds = [
    { id: 1, name: 'Summer Sale 2026', status: 'active' },
    { id: 2, name: 'Electronics Mega Sale', status: 'active' },
    { id: 3, name: 'Restaurant Grand Opening', status: 'active' },
    { id: 4, name: 'Fitness Center Membership', status: 'active' },
    { id: 5, name: 'Tech Gadgets Sale', status: 'active' },
  ];

  // Mock scheduled ads data
  const [scheduledAds, setScheduledAds] = useState([
    {
      id: 1,
      adName: 'Summer Sale 2026',
      adBoxId: 1,
      adBoxName: 'Mall Road, Kochi',
      date: '2026-01-14',
      startTime: '09:00',
      endTime: '12:00',
      status: 'scheduled'
    },
    {
      id: 2,
      adName: 'Electronics Mega Sale',
      adBoxId: 1,
      adBoxName: 'Mall Road, Kochi',
      date: '2026-01-14',
      startTime: '14:00',
      endTime: '18:00',
      status: 'scheduled'
    },
    {
      id: 3,
      adName: 'Restaurant Grand Opening',
      adBoxId: 2,
      adBoxName: 'MG Road, Bangalore',
      date: '2026-01-14',
      startTime: '10:00',
      endTime: '14:00',
      status: 'running'
    },
    {
      id: 4,
      adName: 'Fitness Center Membership',
      adBoxId: 3,
      adBoxName: 'Park Street, Kolkata',
      date: '2026-01-15',
      startTime: '09:00',
      endTime: '17:00',
      status: 'scheduled'
    },
  ]);

  const [scheduleForm, setScheduleForm] = useState({
    adId: '',
    adBoxId: '',
    date: '',
    startTime: '',
    endTime: '',
    repeat: 'none'
  });

  // Time slots for the day
  const timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Get current month calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getScheduledAdsForDate = (date) => {
    const dateStr = formatDate(date);
    return scheduledAds.filter(ad => ad.date === dateStr);
  };

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setViewMode('timeline');
  };

  const handleScheduleAd = () => {
    if (!scheduleForm.adId || !scheduleForm.adBoxId || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedAd = availableAds.find(ad => ad.id === parseInt(scheduleForm.adId));
    const selectedBox = adBoxes.find(box => box.id === parseInt(scheduleForm.adBoxId));

    const newSchedule = {
      id: scheduledAds.length + 1,
      adName: selectedAd.name,
      adBoxId: selectedBox.id,
      adBoxName: selectedBox.name,
      date: scheduleForm.date,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      status: 'scheduled'
    };

    setScheduledAds([...scheduledAds, newSchedule]);
    setShowScheduleModal(false);
    setScheduleForm({
      adId: '',
      adBoxId: '',
      date: '',
      startTime: '',
      endTime: '',
      repeat: 'none'
    });
    alert('Ad scheduled successfully!');
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setScheduledAds(scheduledAds.filter(ad => ad.id !== scheduleId));
      alert('Schedule deleted successfully');
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredScheduledAds = selectedAdBox === 'all' 
    ? scheduledAds 
    : scheduledAds.filter(ad => ad.adBoxId === parseInt(selectedAdBox));

  return (
    <div className="scheduling-page">
      <div className="page-header">
        <div>
          <h1>Ad Scheduling</h1>
          <p className="page-subtitle">Schedule and manage ad campaigns across ad boxes</p>
        </div>
        <button className="btn-schedule-new" onClick={() => setShowScheduleModal(true)}>
          ➕ Schedule New Ad
        </button>
      </div>

      {/* Scroll Container */}
      <div className="scheduling-scroll">
        {/* View Toggle and Filters */}
        <div className="controls-bar">
          <div className="view-toggles">
            <button 
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </button>
            <button 
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              📊 Timeline
            </button>
          </div>

          <div className="filter-box-select">
            <label>Ad Box:</label>
            <select value={selectedAdBox} onChange={(e) => setSelectedAdBox(e.target.value)}>
              <option value="all">All Ad Boxes</option>
              {adBoxes.map(box => (
                <option key={box.id} value={box.id}>{box.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="calendar-view">
            <div className="calendar-header">
              <button className="month-nav-btn" onClick={handlePreviousMonth}>‹</button>
              <h2>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
              <button className="month-nav-btn" onClick={handleNextMonth}>›</button>
            </div>

            <div className="calendar-grid">
              <div className="calendar-weekdays">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
              </div>

              <div className="calendar-days">
                {getDaysInMonth(selectedDate).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                  }

                  const isToday = formatDate(date) === formatDate(new Date());
                  const isSelected = formatDate(date) === formatDate(selectedDate);
                  const scheduledForDate = getScheduledAdsForDate(date);

                  return (
                    <div 
                      key={index}
                      className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDateClick(date)}
                    >
                      <div className="day-number">{date.getDate()}</div>
                      {scheduledForDate.length > 0 && (
                        <div className="schedule-indicator">
                          <span className="schedule-count">{scheduledForDate.length}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="timeline-view">
            <div className="timeline-header">
              <h3>Schedule for {selectedDate.toDateString()}</h3>
            </div>

            <div className="timeline-content">
              <div className="timeline-sidebar">
                <div className="timeline-label">Time</div>
                {timeSlots.map((time, index) => (
                  <div key={index} className="time-slot-label">{time}</div>
                ))}
              </div>

              <div className="timeline-grid">
                {adBoxes.map(box => (
                  <div key={box.id} className="timeline-column">
                    <div className="timeline-column-header">
                      <h4>{box.name}</h4>
                      <span className={`box-status ${box.status}`}>{box.status}</span>
                    </div>
                    <div className="timeline-slots">
                      {timeSlots.map((time, index) => (
                        <div key={index} className="timeline-slot"></div>
                      ))}
                      
                      {/* Render scheduled ads */}
                      {filteredScheduledAds
                        .filter(ad => ad.adBoxId === box.id && ad.date === formatDate(selectedDate))
                        .map(ad => {
                          const startHour = parseInt(ad.startTime.split(':')[0]);
                          const endHour = parseInt(ad.endTime.split(':')[0]);
                          const duration = endHour - startHour;
                          
                          return (
                            <div 
                              key={ad.id}
                              className={`scheduled-block ${ad.status}`}
                              style={{
                                top: `${startHour * 60}px`,
                                height: `${duration * 60}px`
                              }}
                            >
                              <div className="scheduled-content">
                                <strong>{ad.adName}</strong>
                                <span>{ad.startTime} - {ad.endTime}</span>
                                <button 
                                  className="delete-schedule-btn"
                                  onClick={() => handleDeleteSchedule(ad.id)}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Schedules List */}
        <div className="upcoming-schedules">
          <h3>Upcoming Schedules</h3>
          <div className="schedules-list">
            {filteredScheduledAds
              .filter(ad => new Date(ad.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(ad => (
                <div key={ad.id} className="schedule-item">
                  <div className="schedule-info">
                    <h4>{ad.adName}</h4>
                    <p>📍 {ad.adBoxName}</p>
                    <p>📅 {ad.date} • ⏰ {ad.startTime} - {ad.endTime}</p>
                  </div>
                  <div className="schedule-actions">
                    <span className={`status-badge ${ad.status}`}>{ad.status}</span>
                    <button 
                      className="btn-delete-small"
                      onClick={() => handleDeleteSchedule(ad.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule New Ad</h2>
              <button className="close-btn" onClick={() => setShowScheduleModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Select Ad *</label>
                <select 
                  value={scheduleForm.adId}
                  onChange={(e) => setScheduleForm({...scheduleForm, adId: e.target.value})}
                  required
                >
                  <option value="">Choose an ad...</option>
                  {availableAds.map(ad => (
                    <option key={ad.id} value={ad.id}>{ad.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Ad Box *</label>
                <select 
                  value={scheduleForm.adBoxId}
                  onChange={(e) => setScheduleForm({...scheduleForm, adBoxId: e.target.value})}
                  required
                >
                  <option value="">Choose ad box...</option>
                  {adBoxes.filter(box => box.status === 'online').map(box => (
                    <option key={box.id} value={box.id}>{box.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                  min={formatDate(new Date())}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input 
                    type="time"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <input 
                    type="time"
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Repeat</label>
                <select 
                  value={scheduleForm.repeat}
                  onChange={(e) => setScheduleForm({...scheduleForm, repeat: e.target.value})}
                >
                  <option value="none">No Repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleScheduleAd}>
                Schedule Ad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduling;
