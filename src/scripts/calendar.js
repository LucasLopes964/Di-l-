document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const listEl = document.getElementById('inspectionList');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    buttonText: {
      today: 'Hoje'
    },
    events: function(fetchInfo, successCallback, failureCallback) {
      fetch('/api/inspections/calendar')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const events = data.flatMap(inspection => [
            {
              title: inspection.title,
              start: inspection.start,
              display: 'block',
              backgroundColor: '#E0F7FA',
              borderColor: '#00B5E2',
              textColor: '#007991',
              extendedProps: {
                type: 'start',
                description: inspection.description,
                status: inspection.status 
                
              }
            },
            {
              title: inspection.title,
              start: inspection.end,
              display: 'block',
              backgroundColor: '#FFEBEE',
              borderColor: '#DC2626',
              textColor: '#B71C1C',
              extendedProps: {
                type: 'due',
                description: inspection.description,
                status: inspection.status 
              }
            }
          ]);
          successCallback(events);
        })
        .catch(error => {
          console.error('Error fetching calendar events:', error);
          failureCallback(error);
        });
    },
    eventClick: function(info) {
      renderInspectionCard(info.event);
    },
    dayCellClassNames: 'calendar-day',
    eventClassNames: 'calendar-event'
  });

  calendar.render();

  function renderInspectionCard(event) {
    const isStartDate = event.extendedProps.type === 'start';
    listEl.classList.remove('empty-state');

    const inspection = event.extendedProps.inspection || {};

    listEl.innerHTML = `
      <div class="card shadow rounded p-4" style="min-width: 1155px; margin: 1rem auto; text-align: left; float: left;">
        <h3 style="font-size: var(--text-h3); margin-bottom: 1.5rem;">${inspection.inspection_title || inspection.name || event.title || '-'}</h3>
        <div class="info" style="margin-bottom: 0.3rem;"><strong>Status:</strong> ${inspection.status || event.extendedProps.status || '-'}</div>
        <div class="info" style="margin-bottom: 0.3rem;"><strong>Data de início:</strong> ${
          inspection.starting_date
            ? new Date(inspection.starting_date).toLocaleDateString()
            : (event.start ? new Date(event.start).toLocaleDateString() : '-')
        }</div>
        <p style="margin-bottom: 1.5rem;"><strong>Observações:</strong> ${event.extendedProps.description}</p>
        <a class="button button-primary" href="/inspection?id=${inspection.id || event.id}" style="margin-top: 0.5rem;">Ver detalhes</a>
      </div>
    `;
  }

  function showEmptyState() {
    listEl.classList.add('empty-state');
    listEl.innerHTML = `
      <div class="empty-state">
        <div>Nenhuma inspeção selecionada.<br> Clique em uma inspeção no calendário.</div>
      </div>
    `;
  }

  showEmptyState();
});
