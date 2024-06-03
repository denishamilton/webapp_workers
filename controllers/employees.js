// /controllers/employees.js

const { prisma } = require('../prisma/prisma-client');
/*
	@route GET api/employees
	@desc Get all employees
	@access Private
*/
const all = async ( req, res ) => {
	try {
		const employees = await prisma.employee.findMany();

		res.status(200).json(employees);
	} catch (error) {
		res.status(500).json({message: 'Fehler beim bekommen der Mitarbeiterdaten!'})
	}
}

/*
	@route POST api/employees
	@desc Add new employee
	@access Private
*/
const add = async ( req, res ) => {
	try {
		const data = req.body;

		if (!data.firstName || !data.lastName || !data.age || !data.address) {
			return res.status(400).json({message: 'Bitte alle Felder ausfuellen!'});
		}


		const employee = await prisma.employee.create({
			data: {
				...data,
				userId: req.user.id
			}
		});

		return res.status(201).json(employee);

	} catch (error) {
		return res.status(500).json({message: 'Etwas ist schief gelaufen!'});
	}
}

// @route POST api/employees/remove/:id
// @desc Remove employee
// @access Private
const remove = async (req, res) => {
	const { id } = req.body;

	try {
		await prisma.employee.delete({
			where: {
				id
			}
		});

		res.status(204).json({ message: 'Erfolgreich gelöscht!' });
	} catch (error) {
		res.status(500).json({ message: 'Löschen fehlgeschlagen!' });
	}
};

// @route PUT api/employees/edit/:id
// @desc Edit employee
// @access Private
const edit = async ( req, res ) => {
	const data = req.body;
	const id = data.id;

	try {
		await prisma.employee.update({
			where: {
				id
			},
			data
		});

		res.status(204).json({message: 'Erfolgreich geändert!'});
} catch (error) {
		res.status(500).json({message: 'Update des Mitarbeiters fehlgeschlagen!'})
	}
}

// @route GET api/employees/:id
// @desc Get single employee
// @access Private
const employee = async ( req, res ) => {
	const {id} = req.params;

	try {
		const employee = await prisma.employee.findUnique({
			where: {
				id
			}
		});

		res.status(200).json(employee);
	} catch (error) {
		res.status(500).json({message: 'Fehler beim bekommen der Mitarbeiterdaten!'})
	}
}

module.exports = { 
	all,
	add,
	remove,
	employee,
	edit
}