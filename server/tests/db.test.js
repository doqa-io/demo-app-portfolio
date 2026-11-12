describe('db.js', () => {
    it('does not print the connection settings (password included) when loaded', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.isolateModules(() => {
            const pool = require('../db');
            pool.end();
        });
        expect(logSpy).not.toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
