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

		// await prisma.user.update({
		// 	where: {
		// 		id: req.user.id
		// 	},
		// 	data: {
		// 		createdEmployee: {
		// 			create: data
		// 		}
		// 	}
		// });

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

module.exports = { 
	all,
	add
}