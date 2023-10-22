const authController = require('../Controllers/AuthController');

const User = require('../Models/Users');
const bcrypt = require('bcryptjs');

jest.mock('../Models/Users');
jest.mock('bcryptjs');

describe('Authentication Controller Unit Tests', () => {
    describe('register', () => {
        it('should register a new user', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'testpassword',
                },
            };
            const res = {
                status: jest.fn(),
                json: jest.fn(),
            };
            User.create.mockResolvedValue({
                username: 'testuser',
                email: 'testuser@example.com',
                password: '$2a$10$gaKadE0PvMVhzS2Re5OyjeDbU5U22GAIRDYONenOgzDHGBJT42Iwe',
                verificationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieW91c3NlZiIsImVtYWlsIjoieW91c3NlZkBnbWFpbC5jb20iLCJpYXQiOjE2OTc4MDA2OTMsImV4cCI6MTY5NzgwMTI5M30.4cx-oGTI7Rmwc3vDN6Ph205zpnSpczum_4EGCAYeAao',
                isVerified: false,
                verified: null,
                passwordToken: null,
                passwordTokenExpirationDate: null,
            });

            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User registration successful' });
            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'testuser@example.com',
                password: expect.any(String),
                verificationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieW91c3NlZiIsImVtYWlsIjoieW91c3NlZkBnbWFpbC5jb20iLCJpYXQiOjE2OTc4MDA2OTMsImV4cCI6MTY5NzgwMTI5M30.4cx-oGTI7Rmwc3vDN6Ph205zpnSpczum_4EGCAYeAao',
                isVerified: false,
                verified: null,
                passwordToken: null,
                passwordTokenExpirationDate: null,
            });
        });
    });

    describe('login', () => {
        it('should log in a registered user', async () => {
            // Mock the request and response objects
            const req = {
                body: {
                    email: 'testuser@example.com',
                    password: 'testpassword',
                },
            };
            const res = {
                status: jest.fn(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValue({
                username: 'testuser',
                email: 'testuser@example.com',
                password: '$2a$10$gaKadE0PvMVhzS2Re5OyjeDbU5U22GAIRDYONenOgzDHGBJT42Iwe',
                verificationToken: 'verificationtoken',
                isVerified: false,
                verified: null,
                passwordToken: null,
                passwordTokenExpirationDate: null,
            });

            bcrypt.compare.mockResolvedValue(true);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ user: expect.any(Object) });
            expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
        });
    });
});
