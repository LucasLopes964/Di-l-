document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/inspections');
    const inspections = await res.json();

    const atrasadas = inspections.filter(i => i.status === 'atrasada').length;
    const pendentes = inspections.filter(i => i.status === 'em_andamento').length;
    const concluidas = inspections.filter(i => i.status === 'concluida').length;

    if (window.meuGrafico) {
      window.meuGrafico.data.datasets[0].data = [atrasadas, pendentes, concluidas];
      window.meuGrafico.update();
    }
    if (window.meuGrafico2) {
      window.meuGrafico2.data.datasets[0].data = [atrasadas, pendentes, concluidas];
      window.meuGrafico2.update();
    }
  } catch (err) {
    console.error('Erro ao buscar inspeções:', err);
  }
});