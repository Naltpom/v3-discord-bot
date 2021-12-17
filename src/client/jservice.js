const axios = require('axios');
require('dotenv-flow').config({silent: true});
const env = process.env;
const endPoint = env.JSERVICE_ENDPOINT

class JserviceClient
{
	/**
	 * @param {number} nbQuestions number of clues to send with the question
	 */
	static async getAnswer(nbQuestions = 1) {
		const req = axios.get('https://jservice.io/api/random')
			.then(res => {
				console.log(res.data);
			})
		;
	}
}

JserviceClient.getAnswer().then(i => {console.log(i)});

module.exports = JserviceClient;