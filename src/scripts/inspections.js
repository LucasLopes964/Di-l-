document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
  const filterBtn = document.getElementById('filterBtn');
  const allCards = document.querySelectorAll('.inspection-card');

  function filterCards() {
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase();
    allCards.forEach(card => {
      const title = card.querySelector('.inspection-card-title').textContent.toLowerCase();
      const desc = card.querySelector('.inspection-card-description').textContent.toLowerCase();
      if (title.includes(query) || desc.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (filterBtn) filterBtn.addEventListener('click', filterCards);

  document.querySelectorAll('.inspection-list-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const id = item.getAttribute('data-id');
      window.location.href = '/inspection?id=' + id;
    });
  });

  const createBtn = document.getElementById('createBtn');
  if (createBtn) {
    createBtn.addEventListener('click', function () {
      window.location.href = '/inspection/creation';
    });
  }
});