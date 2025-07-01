function showEventsOnDate(date){
  const container = document.getElementById('eventsList');
  container.innerHTML = '';
  eventsData.filter(e => e.date===date).forEach(e => {
    container.innerHTML += `
      <div class="event-item" onclick="openEventModal(${e.id})">
        <div class="event-title">${e.title}</div>
        <div class="event-date"><i class="fas fa-calendar-alt"></i> ${e.date}</div>
        <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${e.municipi}</div>
      </div>`;
  });
}
function openEventModal(id) { /* cerca event i mostra modal */ }
