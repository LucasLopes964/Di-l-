const environmentsModel = require('../../models/environmentsModel');
const environmentsService = require('../../services/environmentsService');
const id = '00000000-0000-0000-0000-000000000001';
const inspection_id = '00000000-0000-0000-0000-000000000002';

jest.mock('../../models/environmentsModel');

describe('Environments Service', () => {
  // --- SUCESSO ---
  test('deve criar um novo ambiente', async () => {
    const data = { name: 'Sala 101', inspection_id };
    environmentsModel.createEnvironment.mockResolvedValue({ ...data });
    const result = await environmentsService.createEnvironment(data);
    expect(result).toEqual(data);
  });

  test('deve atualizar um ambiente', async () => {
    const data = { name: 'Sala 102', inspection_id };
    environmentsModel.updateEnvironment.mockResolvedValue({ id, ...data });
    const result = await environmentsService.updateEnvironment(id, data);
    expect(result).toEqual({ id, ...data });
  });

  test('deve deletar um ambiente', async () => {
    environmentsModel.deleteEnvironment.mockResolvedValue({ id });
    const result = await environmentsService.deleteEnvironment(id);
    expect(result).toEqual({ id });
  });

  test('deve obter ambientes por inspection_id', async () => {
    environmentsModel.getEnvironmentsById.mockResolvedValue([{ id, name: 'Sala 101', inspection_id }]);
    const result = await environmentsService.getEnvironmentsById(inspection_id);
    expect(result).toEqual([{ id, name: 'Sala 101', inspection_id }]);
  });

  test('deve obter inspection_id por environment_id', async () => {
    environmentsModel.getInspectionByEnvironmentId.mockResolvedValue({ inspection_id });
    const result = await environmentsService.getInspectionByEnvironmentId(id);
    expect(result).toEqual({ inspection_id });
  });

  // --- VALIDAÇÃO ---
  test('deve lançar erro se faltar campo ao criar ambiente', async () => {
    await expect(environmentsService.createEnvironment({ name: '', inspection_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar campo ao atualizar ambiente', async () => {
    await expect(environmentsService.updateEnvironment('', { name: '', inspection_id: '' }))
      .rejects.toThrow('Todos os campos são obrigatórios.');
  });

  test('deve lançar erro se faltar id ao deletar ambiente', async () => {
    await expect(environmentsService.deleteEnvironment(''))
      .rejects.toThrow('ID do ambiente é obrigatório.');
  });

  test('deve lançar erro se ambiente não for encontrado ao deletar', async () => {
    environmentsModel.deleteEnvironment.mockResolvedValue(undefined);
    await expect(environmentsService.deleteEnvironment(id))
      .rejects.toThrow('Ambiente não encontrado.');
  });

  test('deve lançar erro se faltar inspection_id ao buscar ambientes', async () => {
    await expect(environmentsService.getEnvironmentsById(''))
      .rejects.toThrow('ID da inspeção é obrigatório.');
  });

  test('deve lançar erro se faltar environment_id ao buscar inspection', async () => {
    await expect(environmentsService.getInspectionByEnvironmentId(''))
      .rejects.toThrow('ID do ambiente é obrigatório.');
  });

  test('deve lançar erro se inspeção não for encontrada ao buscar por environment_id', async () => {
    environmentsModel.getInspectionByEnvironmentId.mockResolvedValue(undefined);
    await expect(environmentsService.getInspectionByEnvironmentId(id))
      .rejects.toThrow('Inspeção não encontrada.');
  });
});