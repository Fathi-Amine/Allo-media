const {login} = require('../Controllers/AuthController');
const User = require('../Models/Users');
const Token = require('../Models/TokenModel');
const jwt = require('jsonwebtoken');

describe('login function', () => {
    it('should log in a user and return a success message', async () => {
        const req = {
            body: {
                email: 'testuser@example.com',
                password: 'password123',
            },
            headers: { 'user-agent': 'test-user-agent' },
            ip: '127.0.0.1',
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        User.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue(Promise.resolve({
                _id: '12345',
                username: 'testuser',
                email: 'testuser@example.com',
                roles: [{ name: 'client' }],
                comparePassword: jest.fn().mockResolvedValue(true),
                isVerified: true,
            })),
        });

        Token.findOne = jest.fn().mockResolvedValue({
            isValid: true,
            refreshToken: 'mock-refresh-token',
        });

        const crypto = require('crypto');
        crypto.randomBytes = jest.fn().mockReturnValue(Buffer.from('mock-refresh-token', 'hex'));

        const secretKey = 'sMeqXQW0y1HHXUHI19SNzOOZ6XU9a2N1';

        const payload = { user: 'user_id' };

        const validToken = jwt.sign(payload, secretKey);

        jwt.sign = jest.fn().mockReturnValue(validToken);

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
        expect(User.findOne().populate).toHaveBeenCalledWith('roles');
        expect(Token.findOne).toHaveBeenCalledWith({ user: '12345' });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            user: {
                name: 'testuser',
                email: 'testuser@example.com',
                role: 'client',
            },
        });
    });
});
