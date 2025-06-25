const db = require('../../config/db.js');
const Inspections = require('../../models/inspectionsModel');
const id = '00000000-0000-0000-0000-000000000001';
const address_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../config/db.js');

describe('Inspections Model', () => {
  beforeEach(() => jest.clearAllMocks());

  test('deve obter todas as inspeções', async () => {
    db.query.mockResolvedValue({
      rows: [
        { id: id, inspection_title: "Inspeção - Inteli" },
        { id: '00000000-0000-0000-0000-000000000003', inspection_title: "Inspeção - Outro prédio" }
      ]
    });

    const inspections = await Inspections.getInspections();
    expect(inspections).toEqual([
      { id: id, inspection_title: "Inspeção - Inteli" },
      { id: '00000000-0000-0000-0000-000000000003', inspection_title: "Inspeção - Outro prédio" }
    ]);
  });

  test('deve criar uma nova inspeção', async () => {
    db.query.mockResolvedValue({
      rows: [{
        id: id,
        inspection_title: "Inspeção - Inteli",
        address_id: address_id,
        starting_date: "01-01-2000",
        due_date: "02-02-2000",
        building_type: "comercial",
        description: "Inspeção realizada na faculdade Inteli",
        status: "em_andamento"
      }]
    });

    const newInspection = await Inspections.createInspection(
      "Inspeção - Inteli",
      address_id,
      "01-01-2000",
      "02-02-2000",
      "comercial",
      "Inspeção realizada na faculdade Inteli",
      "em_andamento"
    );
    expect(newInspection).toEqual({
      id: id,
      inspection_title: "Inspeção - Inteli",
      address_id: address_id,
      starting_date: "01-01-2000",
      due_date: "02-02-2000",
      building_type: "comercial",
      description: "Inspeção realizada na faculdade Inteli",
      status: "em_andamento"
    });
  });

  test('deve atualizar uma inspeção', async () => {
    db.query.mockResolvedValue({
      rows: [{
        id: id,
        inspection_title: "Inspeção - Atualizada",
        address_id: address_id,
        starting_date: "01-01-2000",
        due_date: "02-02-2000",
        building_type: "comercial",
        description: "Atualizada",
        status: "finalizada"
      }]
    });

    const updatedInspection = await Inspections.updateInspection(
      id,
      "Inspeção - Atualizada",
      address_id,
      "01-01-2000",
      "02-02-2000",
      "comercial",
      "Atualizada",
      "finalizada"
    );
    expect(updatedInspection).toEqual({
      id: id,
      inspection_title: "Inspeção - Atualizada",
      address_id: address_id,
      starting_date: "01-01-2000",
      due_date: "02-02-2000",
      building_type: "comercial",
      description: "Atualizada",
      status: "finalizada"
    });
  });

  test('deve deletar uma inspeção', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: id }]
    });

    const deletedInspection = await Inspections.deleteInspection(id);
    expect(deletedInspection).toEqual({ id: id });
  });

  test('deve obter inspeção por id', async () => {
    db.query.mockResolvedValue({ rows: [{
      id: id,
      inspection_title: "Inspeção - Inteli",
      address_id: address_id,
      starting_date: "01-01-2000",
      due_date: "02-02-2000",
      building_type: "comercial",
      description: "Inspeção realizada na faculdade Inteli",
      status: "em_andamento"
    }]});
    const inspection = await Inspections.getInspectionsById(id);
    expect(inspection).toEqual({
      id: id,
      inspection_title: "Inspeção - Inteli",
      address_id: address_id,
      starting_date: "01-01-2000",
      due_date: "02-02-2000",
      building_type: "comercial",
      description: "Inspeção realizada na faculdade Inteli",
      status: "em_andamento"
    });
  });

  test('deve lançar erro se inspeção não for encontrada por id', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(Inspections.getInspectionsById('id-invalido'))
      .rejects.toThrow('Inspeção não encontrada');
  });

  test('deve lançar erro ao falhar em obter inspeção por id', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Inspections.getInspectionsById(id))
      .rejects.toThrow('Erro ao consultar inspeção por ID: DB error');
  });

  test('deve obter inspeções para o calendário', async () => {
    db.query.mockResolvedValue({ rows: [{ id: id, inspection_title: "Inspeção - Inteli", starting_date: "01-01-2000", due_date: "02-02-2000", description: "desc", status: "em_andamento" }] });
    const result = await Inspections.getInspectionsForCalendar();
    expect(result).toEqual([{ id: id, inspection_title: "Inspeção - Inteli", starting_date: "01-01-2000", due_date: "02-02-2000", description: "desc", status: "em_andamento" }]);
  });

  test('deve lançar erro ao falhar em obter inspeções para o calendário', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Inspections.getInspectionsForCalendar())
      .rejects.toThrow('Erro ao carregar inspeções para o calendário: DB error');
  });

  test('deve obter inspeções com endereço', async () => {
    db.query.mockResolvedValue({ rows: [{ id: id, inspection_title: "Inspeção - Inteli", address: "Rua X" }] });
    const result = await Inspections.getInspectionsWithAddress();
    expect(result).toEqual([{ id: id, inspection_title: "Inspeção - Inteli", address: "Rua X" }]);
  });

  test('deve lançar erro ao falhar em obter inspeções com endereço', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Inspections.getInspectionsWithAddress())
      .rejects.toThrow('Erro ao consultar inspeções com endereço: DB error');
  });

  test('deve obter próxima inspeção pela due_date', async () => {
    db.query.mockResolvedValue({ rows: [{ id: id, inspection_title: "Inspeção - Inteli", due_date: "02-02-2000" }] });
    const result = await Inspections.getInspectionsNextDueDate();
    expect(result).toEqual({ id: id, inspection_title: "Inspeção - Inteli", due_date: "02-02-2000" });
  });

  test('deve lançar erro ao falhar em obter próxima inspeção', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Inspections.getInspectionsNextDueDate())
      .rejects.toThrow('Erro ao consultar próxima inspeção: DB error');
  });

  test('deve obter inspeções do calendário por user_id', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ team_id: 1 }] }) // team_assignments
      .mockResolvedValueOnce({ rows: [{ inspection_id: id }] }) // teams
      .mockResolvedValueOnce({ rows: [{ id: id, inspection_title: "Inspeção - Inteli", starting_date: "01-01-2000", due_date: "02-02-2000", description: "desc", status: "em_andamento" }] }); // inspections

    const result = await Inspections.getInspectionsForCalendarByUserId('user-id');
    expect(result).toEqual([{ id: id, inspection_title: "Inspeção - Inteli", starting_date: "01-01-2000", due_date: "02-02-2000", description: "desc", status: "em_andamento" }]);
  });

  test('deve retornar array vazio se usuário não tiver times no calendário', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // team_assignments
    const result = await Inspections.getInspectionsForCalendarByUserId('user-id');
    expect(result).toEqual([]);
  });

  test('deve retornar array vazio se times não tiverem inspeções', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ team_id: 1 }] }) // team_assignments
      .mockResolvedValueOnce({ rows: [] }); // teams
    const result = await Inspections.getInspectionsForCalendarByUserId('user-id');
    expect(result).toEqual([]);
  });

  test('deve retornar inspeções com endereço para o usuário', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ team_id: 1 }] }) 
      .mockResolvedValueOnce({ rows: [{ inspection_id: 2 }] })
      .mockResolvedValueOnce({ rows: [{ id: 2, address: 'Rua Teste' }] }); 
    const resultado = await Inspections.getInspectionsWithAddressByUserId(123);
    expect(resultado).toEqual([{ id: 2, address: 'Rua Teste' }]);
    expect(db.query).toHaveBeenCalledTimes(3);
  });

  test('deve retornar array vazio se usuário não tem times', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // nenhum time

    const resultado = await Inspections.getInspectionsWithAddressByUserId(123);
    expect(resultado).toEqual([]);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('deve retornar array vazio se times não possuem inspeções', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ team_id: 1 }] }) // time existe
      .mockResolvedValueOnce({ rows: [] }); // nenhuma inspeção

    const resultado = await Inspections.getInspectionsWithAddressByUserId(123);
    expect(resultado).toEqual([]);
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  test('deve lançar erro ao falhar em obter todas as inspeções', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Inspections.getInspections())
      .rejects.toThrow('Erro ao consultar inspeções: DB error');
  });

  test('deve lançar erro ao falhar em criar inspeção', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(
      Inspections.createInspection(
        "Inspeção - Inteli",
        address_id,
        "01-01-2000",
        "02-02-2000",
        "comercial",
        "Inspeção realizada na faculdade Inteli",
        "em_andamento"
      )
    ).rejects.toThrow('Erro ao criar inspeção: DB error');
  });

  test('deve lançar erro ao falhar em atualizar inspeção', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(
      Inspections.updateInspection(
        id,
        "Inspeção - Atualizada",
        address_id,
        "01-01-2000",
        "02-02-2000",
        "comercial",
        "Atualizada",
        "finalizada"
      )
    ).rejects.toThrow('Erro ao atualizar inspeção: DB error');
  });

  test('deve lançar erro ao falhar em deletar inspeção', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(Inspections.deleteInspection(id))
      .rejects.toThrow('Erro ao deletar inspeção: DB error');
  });

});