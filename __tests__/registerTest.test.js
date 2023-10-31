const {register} = require('../Controllers/AuthController');
const User = require('../Models/Users');
const assignRolesToUser = require('../Controllers/RoleController');
const sendVerificationEmail = require('../Utils/SendVerificationEmail');
const jwt = require('jsonwebtoken');


const mockedVerificationToken = jwt.sign({ name: 'testuser', email: 'testuser@example.com' }, 'your_testing_secret_key', { expiresIn: '10m' });

jest.mock('../Controllers/RoleController');
jest.mock('../Utils/SendVerificationEmail');
process.env.JWT_SECRET = 'sMeqXQW0y1HHXUHI19SNzOOZ6XU9a2N1';
describe('register function', () => {
    it('should register a new user and return a success message', async () => {
        // Mock request and response objects
        const req = {
            get: jest.fn().mockReturnValue('https://example.com'),
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'secret123',
                status: 3,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.create = jest.fn().mockResolvedValue({
            _id: '12345',
            username: 'testuser',
            email: 'testuser@example.com',
            status: 3,
            verificationToken: mockedVerificationToken,
        });

        assignRolesToUser.mockResolvedValue();
        sendVerificationEmail.mockResolvedValue();

        await register(req, res);

        expect(req.get).toHaveBeenCalledWith('origin');
        expect(User.create).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'secret123',
            status: 3,
            verificationToken: expect.any(String),
        });
        expect(assignRolesToUser).toHaveBeenCalledWith('12345', 'client');
        expect(sendVerificationEmail).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'testuser@example.com',
            verificationToken: expect.any(String),
            origin: 'https://example.com',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Success! Please check your email for verification' });
    });
});
