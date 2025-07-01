let today = new Date(), currentMonth = today.getMonth(), currentYear = today.getFullYear();
function renderCalendar() {
  let grid = document.getElementById('calendarGrid'); grid.innerHTML = '';
  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let daysInM = new Date(currentYear, currentMonth+1, 0).getDate();
  for (let i=0;i<firstDay;i++) grid.innerHTML += '<div class="calendar-day other-month"></div>';
  for (let d=1; d<=daysInM; d++){
    let cell = document.createElement('div'); cell.className = 'calendar-day';
    cell.innerText = d;
    let full = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (eventsData.some(e=>e.date===full)) cell.classList.add('has-event');
    if (d===today.getDate()&&currentMonth===today.getMonth()) cell.classList.add('today');
    cell.onclick = ()=> showEventsOnDate(full);
    grid.appendChild(cell);
  }
  document.getElementById('currentMonth').textContent =
    today.toLocaleDateString('ca-ES',{month:'long',year:'numeric', timeZone:'UTC'});
}
