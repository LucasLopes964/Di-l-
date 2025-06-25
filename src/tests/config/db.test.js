const db = require('../../config/db.js');

describe('db config', () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('pg');
    delete process.env.DB_SSL;
  });

  test('deve exportar função query', () => {
    const db = require('../../config/db.js');
    expect(typeof db.query).toBe('function');
  });

  test('deve exportar função connect', () => {
    const db = require('../../config/db.js');
    expect(typeof db.connect).toBe('function');
  });

  test('query deve chamar pool.query com os parâmetros corretos', async () => {
    const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
    jest.doMock('pg', () => ({
      Pool: jest.fn(() => ({
        query: mockQuery,
        connect: jest.fn(),
      })),
    }));

    jest.resetModules();
    const db = require('../../config/db.js');
    await db.query('SELECT 1', [123]);
    expect(mockQuery).toHaveBeenCalledWith('SELECT 1', [123]);
  });

  test('connect deve chamar pool.connect', async () => {
    const mockConnect = jest.fn();
    jest.doMock('pg', () => ({
      Pool: jest.fn(() => ({
        query: jest.fn(),
        connect: mockConnect,
      })),
    }));

    jest.resetModules();
    const db = require('../../config/db.js');
    db.connect();
    expect(mockConnect).toHaveBeenCalled();
  });

  test('Pool deve receber ssl como objeto quando DB_SSL="true"', () => {
    process.env.DB_SSL = 'true';
    const mockPool = jest.fn();
    jest.doMock('pg', () => ({
      Pool: mockPool,
    }));

    jest.resetModules();
    require('../../config/db.js');
    expect(mockPool).toHaveBeenCalledWith(
      expect.objectContaining({
        ssl: { rejectUnauthorized: false }
      })
    );
  });

  test('Pool deve receber ssl como false quando DB_SSL!="true"', () => {
    process.env.DB_SSL = 'false';
    const mockPool = jest.fn();
    jest.doMock('pg', () => ({
      Pool: mockPool,
    }));

    jest.resetModules();
    require('../../config/db.js');
    expect(mockPool).toHaveBeenCalledWith(
      expect.objectContaining({
        ssl: false
      })
    );
  });
});