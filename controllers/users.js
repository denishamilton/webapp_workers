const {prisma} = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @route POST api/user/login
// @desc Login user
// @access Public
const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json('Bitte gib deine Email und dein Passwort ein');
	}

	const user = await prisma.user.findFirst({
		where: {
			email,
		}
	});

	const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));
	const secret = process.env.JWT_SECRET;

	if (user && isPasswordCorrect && secret) {
		res.status(200).json({
			id: user.id,
			email: user.email,
			name: user.name,
			token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }), 
		})
	} else {
		return res.status(400).json({message: 'Falsche Email oder Passwort'})
	}

}

// @route POST api/user/register
// @desc Register user
// @access Public
const register = async (req, res, next) => {
	const {email, password, name} = req.body;

	if (!email || !password || !name) {
		return res.status(400).json({message: 'Bitte alle Felder ausfuellen!'});
	}

	const registeredUser = await prisma.user.findFirst({
		where: {
			email
		}
	});

	if (registeredUser) {
		return res.status(400).json({message: 'Email ist bereits vergeben!'});
	}

	const salt = await bcrypt.genSalt(10);

	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await prisma.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
		}
	});

	const secret = process.env.JWT_SECRET;

	if (user && secret) {
		res.status(201).json({
			id: user.id,
			email: user.email,
			name: user.name,
			token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
		})
	} else {
		return res.status(400).json({message: 'Benutzerdaten konnten nicht erstellt werden!'});
	}
}

// @route GET api/user/current
// @desc Get current user
// @access Private
const current = async (req, res) => {
	return res.status(200).json(req.user)
}

module.exports = { 
	login,
	register,
	current
}