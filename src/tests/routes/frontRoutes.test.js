const express = require('express');
const request = require('supertest');
const path = require('path');
const teamsModel = require('../../models/teamsModel');
const inspectionsModel = require('../../models/inspectionsModel');
const teamAssignmentsModel = require('../../models/teamAssignmentsModel');
const usersModel = require('../../models/usersModel');
const inspectionsController = require('../../controllers/inspectionsController');

// filepath: src/tests/routes/frontRoutes.test.js

jest.mock('../../models/teamsModel');
jest.mock('../../models/inspectionsModel');
jest.mock('../../models/teamAssignmentsModel');
jest.mock('../../controllers/inspectionsController');
jest.mock('../../models/usersModel');


let app;
function getApp(sessionData = {}) {
    app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../views'));
    // Mock session middleware
    app.use((req, res, next) => {
        req.session = sessionData;
        next();
    });
    app.render = (view, options, callback) => {
        // Simula o render, retorna os dados como JSON para facilitar o teste
        if (typeof options === 'function') callback = options;
        if (callback) return callback(null, JSON.stringify({ view, ...options }));
        return JSON.stringify({ view, ...options });
    };
    app.use('/', require('../../routes/frontRoutes'));
    return app;
}

describe('frontRoutes', () => {
    const user = { id: 1, is_admin: false, name: 'Test User' };
    const admin = { id: 2, is_admin: true, name: 'Admin User' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /login', () => {
        test('deve renderizar página de login', async () => {
            const app = getApp({});
            const res = await request(app).get('/login');
            expect(res.status).toBe(200);
            expect(JSON.parse(res.text).view).toMatch(/login/);
        });
    });

    describe('GET /', () => {
        test('deve renderizar home sem inspeções se usuário não tem equipes', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([]);
            teamsModel.getTeams.mockResolvedValue([]);
            inspectionsModel.getInspections.mockResolvedValue([
            { id: 100, name: 'insp1' },
            { id: 200, name: 'insp2' }
            ]);
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Página Inicial');
            expect(body.inspections).toEqual([]);
            expect(body.user).toEqual(user);
        });

        test('deve renderizar home sem inspeções se equipes não possuem inspeções', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([{ team_id: 10 }]);
            teamsModel.getTeams.mockResolvedValue([{ id: 10, inspection_id: undefined }]);
            inspectionsModel.getInspections.mockResolvedValue([
            { id: 100, name: 'insp1' }
            ]);
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.inspections).toEqual([]);
        });

        test('deve renderizar home sem inspeções se não há inspeções cadastradas', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([{ team_id: 10 }]);
            teamsModel.getTeams.mockResolvedValue([{ id: 10, inspection_id: 100 }]);
            inspectionsModel.getInspections.mockResolvedValue([]);
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.inspections).toEqual([]);
        });

        test('deve retornar erro 500 se getTeams lançar erro', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([{ team_id: 10 }]);
            teamsModel.getTeams.mockRejectedValue(new Error('erro equipes'));
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/');
            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Erro ao carregar inspeções/);
        });

        test('deve retornar erro 500 se getInspections lançar erro', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([{ team_id: 10 }]);
            teamsModel.getTeams.mockResolvedValue([{ id: 10, inspection_id: 100 }]);
            inspectionsModel.getInspections.mockRejectedValue(new Error('erro inspeções'));
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/');
            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Erro ao carregar inspeções/);
        });

        test('deve redirecionar para login se não autenticado', async () => {
            const app = getApp({});
            const res = await request(app).get('/');
            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/login');
        });

        test('deve renderizar home com todas as inspeções para admin', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockResolvedValue([]);
            teamsModel.getTeams.mockResolvedValue([]);
            inspectionsModel.getInspections.mockResolvedValue([{ id: 1, name: 'adm-insp' }]);
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.inspections).toEqual([{ id: 1, name: 'adm-insp' }]);
            expect(body.user).toEqual(admin);
        });

        test('deve retornar erro 500 se getTeamAssignmentsByUserId lançar erro', async () => {
            teamAssignmentsModel.getTeamAssignmentsByUserId.mockRejectedValue(new Error('fail'));
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/');
            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Erro ao carregar inspeções/);
        });
    });

    describe('GET /inspections', () => {
        test('deve renderizar inspeções com endereço para admin', async () => {
            inspectionsModel.getInspectionsWithAddress.mockResolvedValue([{ id: 1, address: 'Rua A' }]);
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/inspections');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Inspeções');
            expect(body.activePage).toBe('inspections');
            expect(body.inspections).toEqual([{ id: 1, address: 'Rua A' }]);
            expect(body.user).toEqual(admin);
        });

        test('deve renderizar inspeções do usuário com endereço para inspetor', async () => {
            inspectionsModel.getInspectionsWithAddressByUserId.mockResolvedValue([{ id: 2, address: 'Rua B' }]);
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/inspections');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Inspeções');
            expect(body.activePage).toBe('inspections');
            expect(body.inspections).toEqual([{ id: 2, address: 'Rua B' }]);
            expect(body.user).toEqual(user);
        });

        test('deve retornar erro 500 se inspectionsModel.getInspectionsWithAddressByUserId falhar', async () => {
            inspectionsModel.getInspectionsWithAddressByUserId.mockRejectedValue(new Error('fail'));
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/inspections');
            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Erro ao carregar inspeções/);
        });

        test('deve retornar erro 500 se inspectionsModel.getInspectionsWithAddress falhar para admin', async () => {
            inspectionsModel.getInspectionsWithAddress.mockRejectedValue(new Error('fail'));
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/inspections');
            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Erro ao carregar inspeções/);
        });
    });

    describe('GET /config', () => {
        test('deve renderizar configurações com usuário', async () => {
            usersModel.getUserById.mockResolvedValue(user);
            const app = getApp({ userId: 1 });
            const res = await request(app).get('/config');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Configurações');
            expect(body.user).toEqual(user);
        });

        test('deve renderizar configurações com user null em caso de erro', async () => {
            usersModel.getUserById.mockRejectedValue(new Error('fail'));
            const app = getApp({ userId: 1 });
            const res = await request(app).get('/config');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Configurações');
            expect(body.user).toBeNull();
        });
    });

    describe('GET /calendar', () => {
        test('deve renderizar calendário para admin', async () => {
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/calendar');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Calendário');
            expect(body.activePage).toBe('calendario');
            expect(body.user).toEqual(admin);
        });

        test('deve renderizar calendário do inspetor para não admin', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/calendar');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('CalendárioInspector');
            expect(body.activePage).toBe('calendario');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /teams', () => {
        test('deve renderizar página de equipes', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/teams');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Equipes');
            expect(body.activePage).toBe('teams');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /members', () => {
        test('deve renderizar página de membros', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/members');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Sobre');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /inspection', () => {
        test('deve renderizar página de inspeção', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/inspection');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Inspeção');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /criacaoRegistro', () => {
        test('deve renderizar página de criação de registro', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/criacaoRegistro');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Criação de Registro');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /preview', () => {
        test('deve renderizar página de pré-visualização', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/preview');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Pré-Visualização');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /dashboard', () => {
        test('deve renderizar dashboard', async () => {
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/dashboard');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Tela Inicial ADM');
            expect(body.user).toEqual(admin);
        });
    });

    describe('GET /editarRegistro', () => {
        test('deve renderizar página de edição de registro', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/editarRegistro');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Editar Registro');
            expect(body.activePage).toBe('inspections');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /inspection/creation', () => {
        test('deve renderizar página de criação de inspeção', async () => {
            usersModel.getUsers.mockResolvedValue([{ id: 1, name: 'User' }]);
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/inspection/creation');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Criação de Inspeção');
            expect(body.users).toEqual([{ id: 1, name: 'User' }]);
            expect(body.user).toEqual(admin);
        });

        test('deve retornar erro 500 se getUsers lançar erro', async () => {
            usersModel.getUsers.mockRejectedValue(new Error('fail'));
            const app = getApp({ authenticated: true, user: admin });
            const res = await request(app).get('/inspection/creation');
            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Erro ao carregar a página de criação de inspeção/);
        });
    });

    describe('GET /mapa', () => {
        test('deve renderizar página do mapa', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/mapa');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Mapa');
            expect(body.activePage).toBe('mapa');
            expect(body.user).toEqual(user);
        });
    });

    describe('GET /calendarInspector', () => {
        test('deve renderizar página de calendário do inspetor', async () => {
            const app = getApp({ authenticated: true, user });
            const res = await request(app).get('/calendarInspector');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.text);
            expect(body.pageTitle).toBe('Calendário do Inspetor');
            expect(body.activePage).toBe('calendario');
            expect(body.user).toEqual(user);
        });
    });
});