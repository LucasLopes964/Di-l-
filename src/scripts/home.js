document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.inspection-card[data-inspection-id]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      const id = this.getAttribute('data-inspection-id');
      if (id) {
        window.location.href = `/inspection?id=${id}`;
      }
    });
  });
});