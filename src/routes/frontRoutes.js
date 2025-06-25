const express = require('express');
const router = express.Router();
const path = require('path');
const teamsModel = require('../models/teamsModel');
const inspectionsModel = require('../models/inspectionsModel');
const teamAssignmentsModel = require('../models/teamAssignmentsModel');
const inspectionsController = require('../controllers/inspectionsController');
const coordinatorAssignmentsModel = require('../models/coordinatorAssignmentsModel');

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

// Roteamento para página inicial
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id; 

    const assignments = await teamAssignmentsModel.getTeamAssignmentsByUserId(userId);
    const userTeamIds = assignments.map(a => a.team_id);

    let teams = [];
    if (userTeamIds.length > 0) {
      teams = (await teamsModel.getTeams()).filter(team => userTeamIds.includes(team.id));
    }

    const inspectionIds = teams.map(t => t.inspection_id);

    let inspections = [];
    if (req.session.user.is_admin) {
      inspections = await inspectionsModel.getInspections();
    } else if (inspectionIds.length > 0) {
      inspections = (await inspectionsModel.getInspections()).filter(i => inspectionIds.includes(i.id));
    }

    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Página Inicial',
      content: path.join(__dirname, '../views/pages/home'),
      activePage: 'home',
      inspections,
      user: req.session.user 
    });
  } catch (error) {
    res.status(500).send('Erro ao carregar inspeções: ' + error.message);
  }
});

// Roteamento para a página do mapa
router.get('/mapa', requireAuth, (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Mapa',
    content: path.join(__dirname, '../views/pages/map'),
    activePage: 'mapa',
    user: req.session.user 
  });
});

// Roteamento para a página de login
router.get('/login',  (req, res) => {
  res.render(path.join(__dirname, '../views/pages/login'), {
  user: req.session.user 
  });
});

const loginController = require('../controllers/loginController');
router.post('/login', loginController.login);

// Roteamento para a página do dashboard (Mudar nome futuramente)
router.get('/dashboard', requireAuth, (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Tela Inicial ADM',
    content: path.join(__dirname, '../views/pages/metrics'),
    activePage: '',
    user: req.session.user 
  });
});

// Roteamento para a página de configurações

router.get('/config', async (req, res) => {
  try {
    const userId = req.session.userId;
    const usersModel = require('../models/usersModel');
    const user = await usersModel.getUserById(userId);

    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Configurações',
      content: path.join(__dirname, '../views/pages/settings'),
      activePage: 'config',
      user: user
    });
  } catch (error) {
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Configurações',
      content: path.join(__dirname, '../views/pages/settings'),
      activePage: 'config',
      user: null
    });
  }

});

router.get('/inspections', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    let inspections = [];
    if (user.is_admin === true) {
      inspections = await inspectionsModel.getInspectionsWithAddress();
    } else {
      inspections = await inspectionsModel.getInspectionsWithAddressByUserId(user.id);
    }
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Inspeções',
      content: path.join(__dirname, '../views/pages/inspections'),
      activePage: 'inspections',
      inspections,
      user
    });
  } catch (error) {
    res.status(500).send('Erro ao carregar inspeções: ' + error.message);
  }
});

// Roteamento para a página de inspeção
router.get('/inspection', requireAuth, async (req, res) => {
  try {
    let inspection = await inspectionsModel.getInspectionsById(req.query.id);
    if (Array.isArray(inspection)) inspection = inspection[0];

    // Busque o coordenador da inspeção
    const coordAssignment = await coordinatorAssignmentsModel.getCoordinatorAssignmentsByInspectionId(inspection.id);
    // Supondo que retorna um array, pegue o primeiro (ou ajuste para múltiplos coordenadores)
    const coordinator_id = coordAssignment && coordAssignment[0] ? coordAssignment[0].user_id : null;

    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Inspeção',
      content: path.join(__dirname, '../views/pages/inspection'),
      activePage: 'inspections',
      user: req.session.user,
      inspection,
      coordinator_id // <-- Passe para o EJS
    });
  } catch (error) {
    res.status(500).send('Erro ao carregar a página de inspeção: ' + error.message);
  }
});


// Roteamento para a página de criação de registro
router.get('/criacaoRegistro', requireAuth, (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Criação de Registro',
    content: path.join(__dirname, '../views/pages/registerCreation'),
    activePage: '',
    user: req.session.user 
  });
});

// Roteamento para a página de pré-visualização
router.get('/preview', requireAuth, (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Pré-Visualização',
    content: path.join(__dirname, '../views/pages/preview'),
    activePage: '',
    user: req.session.user 
  });
});

// Roteamento para a página de calendário
router.get('/calendar', requireAuth, (req, res) => {
  if (req.session.user && req.session.user.is_admin) {
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Calendário',
      content: path.join(__dirname, '../views/pages/calendar'),
      activePage: 'calendario',
      user: req.session.user
    });
  } else {
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'CalendárioInspector',
      content: path.join(__dirname, '../views/pages/calendarInspector'),
      activePage: 'calendario',
      user: req.session.user
    });
  }
});

// Roteamento para a página de  criação de inspeção
router.get('/inspection/creation', requireAuth, async (req, res) => {
  try {
    const users = await require('../models/usersModel').getUsers();
    const projectCodesModel = require('../models/projectCodesModel');
    const projectCodes = await projectCodesModel.getAllProjectCodes();

    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Criação de Inspeção',
      content: path.join(__dirname, '../views/pages/inspectionCreation'),
      activePage: '',
      user: req.session.user,
      users,
      projectCodes 
    });
  } catch (error) {
    res.status(500).send('Erro ao carregar a página de criação de inspeção: ' + error.message);
  }
});

router.post('/inspection/create', requireAuth, inspectionsController.createInspection);


router.get('/editarRegistro', requireAuth, (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Editar Registro',
    content: path.join(__dirname, '../views/pages/registerEdit'),
    user: req.session.user,
    activePage: 'inspections'
  });
});
router.get('/api/inspections', requireAuth, inspectionsController.getInspections);

router.get('/calendarInspector', requireAuth, (req, res) => {
  res.render(path.join(__dirname, '../views/pages/calendarInspector'), {
    pageTitle: 'Calendário do Inspetor',
    user: req.session.user,
    activePage: 'calendario'
  });
});

router.get('/inspection/edit', requireAuth, inspectionsController.editInspectionPage);


module.exports = router;