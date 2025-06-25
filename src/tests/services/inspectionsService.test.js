const inspectionsModel = require('../../models/inspectionsModel');
const addressesModel = require('../../models/addressesModel');
const teamsModel = require('../../models/teamsModel');
const teamAssignmentsModel = require('../../models/teamAssignmentsModel');
const coordinatorAssignmentsModel = require('../../models/coordinatorAssignmentsModel');
const inspectionsService = require('../../services/inspectionsService');
const id = '00000000-0000-0000-0000-000000000001';
const address_id = '00000000-0000-0000-0000-000000000002';
const team_id = '00000000-0000-0000-0000-000000000003';
const coordinator_id = '00000000-0000-0000-0000-000000000004';
const user_id = '00000000-0000-0000-0000-000000000005';

jest.mock('../../models/inspectionsModel');
jest.mock('../../models/addressesModel');
jest.mock('../../models/teamsModel');
jest.mock('../../models/teamAssignmentsModel');
jest.mock('../../models/coordinatorAssignmentsModel');

describe('Inspections Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- SUCESSO ---
  test('deve obter todas as inspeções', async () => {
    inspectionsModel.getInspections.mockResolvedValue([{ id }]);
    const result = await inspectionsService.getInspections();
    expect(result).toEqual([{ id }]);
  });

  test('deve criar uma nova inspeção', async () => {
    addressesModel.createAddress.mockResolvedValue({ id: address_id });
    inspectionsModel.createInspection.mockResolvedValue({ id, address_id });
    teamsModel.createTeam.mockResolvedValue({ id: team_id });
    teamAssignmentsModel.createTeamAssignment.mockResolvedValue({});
    coordinatorAssignmentsModel.createCoordinatorAssignment.mockResolvedValue({});

    const data = {
      inspection_title: 'Inspeção',
      endereco: 'Rua X',
      starting_date: '2024-01-01',
      due_date: '2024-01-02',
      building_type: 'comercial',
      description: 'desc',
      status: 'em_andamento',
      image_url: 'img.png',
      latitude: 1,
      longitude: 2,
      coordinator_id,
      members: ['user1', 'user2']
    };

    const result = await inspectionsService.createInspection(data);
    expect(result).toEqual({ id, address_id });
    expect(addressesModel.createAddress).toHaveBeenCalled();
    expect(inspectionsModel.createInspection).toHaveBeenCalled();
    expect(teamsModel.createTeam).toHaveBeenCalled();
    expect(teamAssignmentsModel.createTeamAssignment).toHaveBeenCalledWith('user1', team_id);
    expect(teamAssignmentsModel.createTeamAssignment).toHaveBeenCalledWith('user2', team_id);
    expect(coordinatorAssignmentsModel.createCoordinatorAssignment).toHaveBeenCalledWith(coordinator_id, id);
  });

  test('deve criar inspeção mesmo sem membros (members undefined)', async () => {
    addressesModel.createAddress.mockResolvedValue({ id: address_id });
    inspectionsModel.createInspection.mockResolvedValue({ id, address_id });
    teamsModel.createTeam.mockResolvedValue({ id: team_id });
    coordinatorAssignmentsModel.createCoordinatorAssignment.mockResolvedValue({});

    const data = {
      inspection_title: 'Inspeção',
      endereco: 'Rua X',
      starting_date: '2024-01-01',
      due_date: '2024-01-02',
      building_type: 'comercial',
      description: 'desc',
      status: 'em_andamento',
      image_url: 'img.png',
      latitude: 1,
      longitude: 2,
      coordinator_id
      // members está undefined
    };

    const result = await inspectionsService.createInspection(data);
    expect(result).toEqual({ id, address_id });
    expect(teamAssignmentsModel.createTeamAssignment).not.toHaveBeenCalled();
    expect(coordinatorAssignmentsModel.createCoordinatorAssignment).toHaveBeenCalledWith(coordinator_id, id);
  });

  test('deve criar inspeção sem coordenador (coordinator_id undefined)', async () => {
    addressesModel.createAddress.mockResolvedValue({ id: address_id });
    inspectionsModel.createInspection.mockResolvedValue({ id, address_id });
    teamsModel.createTeam.mockResolvedValue({ id: team_id });

    const data = {
      inspection_title: 'Inspeção',
      endereco: 'Rua X',
      starting_date: '2024-01-01',
      due_date: '2024-01-02',
      building_type: 'comercial',
      description: 'desc',
      status: 'em_andamento',
      image_url: 'img.png',
      latitude: 1,
      longitude: 2,
      members: ['user1', 'user2']
      // coordinator_id está undefined
    };

    const result = await inspectionsService.createInspection(data);
    expect(result).toEqual({ id, address_id });
    expect(coordinatorAssignmentsModel.createCoordinatorAssignment).not.toHaveBeenCalled();
  });

  test('deve atualizar uma inspeção', async () => {
    inspectionsModel.updateInspection.mockResolvedValue({ id, address_id });
    const data = {
      inspection_title: 'Inspeção',
      address_id,
      starting_date: '2024-01-01',
      due_date: '2024-01-02',
      building_type: 'comercial',
      description: 'desc',
      status: 'em_andamento',
      image_url: 'img.png'
    };
    const result = await inspectionsService.updateInspection(id, data);
    expect(result).toEqual({ id, address_id });
  });

  test('deve deletar uma inspeção', async () => {
    inspectionsModel.deleteInspection.mockResolvedValue({ id });
    const result = await inspectionsService.deleteInspection(id);
    expect(result).toEqual({ id });
  });

  test('deve obter inspeção por id', async () => {
    inspectionsModel.getInspectionsById.mockResolvedValue({ id });
    const result = await inspectionsService.getInspectionsById(id);
    expect(result).toEqual({ id });
  });

  test('deve obter inspeções para o calendário', async () => {
    inspectionsModel.getInspectionsForCalendar.mockResolvedValue([
      { id, inspection_title: 'Inspeção', starting_date: '2024-01-01', due_date: '2024-01-02', description: 'desc', status: 'em_andamento' }
    ]);
    const result = await inspectionsService.getInspectionsForCalendar();
    expect(result).toEqual([
      {
        id,
        title: 'Inspeção',
        start: '2024-01-01',
        end: '2024-01-02',
        description: 'desc',
        status: 'em_andamento',
        allDay: true
      }
    ]);
  });

  test('deve obter inspeções para o calendário (sem user_id)', async () => {
    inspectionsModel.getInspectionsForCalendar.mockResolvedValue([
      { id, inspection_title: 'Inspeção', starting_date: '2024-01-01', due_date: '2024-01-02', description: 'desc', status: 'em_andamento' }
    ]);
    const result = await inspectionsService.getInspectionsForCalendar();
    expect(result).toEqual([
      {
        id,
        title: 'Inspeção',
        start: '2024-01-01',
        end: '2024-01-02',
        description: 'desc',
        status: 'em_andamento',
        allDay: true
      }
    ]);
  });

  test('deve obter inspeções para o calendário por usuário', async () => {
    inspectionsModel.getInspectionsForCalendarByUserId.mockResolvedValue([
      { id, inspection_title: 'Inspeção', starting_date: '2024-01-01', due_date: '2024-01-02', description: 'desc', status: 'em_andamento' }
    ]);
    const result = await inspectionsService.getInspectionsForCalendar(user_id);
    expect(result).toEqual([
      {
        id,
        title: 'Inspeção',
        start: '2024-01-01',
        end: '2024-01-02',
        description: 'desc',
        status: 'em_andamento',
        allDay: true
      }
    ]);
  });

  test('deve obter próxima inspeção pela due_date', async () => {
    inspectionsModel.getInspectionsNextDueDate.mockResolvedValue({ id, due_date: '2024-01-02' });
    const result = await inspectionsService.getInspectionsNextDueDate();
    expect(result).toEqual({ id, due_date: '2024-01-02' });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar inspeção', async () => {
    await expect(inspectionsService.createInspection({})).rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar inspeção', async () => {
    await expect(inspectionsService.updateInspection('', {})).rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar inspeção', async () => {
    await expect(inspectionsService.deleteInspection('')).rejects.toThrow('ID da inspeção é obrigatório.');
  });

  test('deve lançar erro se inspeção não for encontrada ao deletar', async () => {
    inspectionsModel.deleteInspection.mockResolvedValue(undefined);
    await expect(inspectionsService.deleteInspection(id)).rejects.toThrow('Inspeção não encontrada.');
  });

  test('deve lançar erro se faltar id ao buscar inspeção', async () => {
    await expect(inspectionsService.getInspectionsById('')).rejects.toThrow('ID da inspeção é obrigatório.');
  });
  
});