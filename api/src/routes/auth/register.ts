import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generateRandomSalt, hashPassword } from '../../utils/hash.utils';
import { User } from '../../interfaces/user';
import {userSchema} from '../../schemas/userSchema';
import generateProfilPicture from '../../utils/generateProfilPicture.utils';

async function registerRoutes(fastify: FastifyInstance) {
    fastify.post('/register', {
        schema: {
            body: userSchema
        }
    }, async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
        const { pseudo, email, password } = request.body;
        const salt = generateRandomSalt(); // Generate a random salt unique to the user
        const hashedPassword = hashPassword(password, salt);

        try {
           const [result] : any = await fastify.db.query(
                'INSERT INTO users (pseudo, email, password, salt, creation_date, profil, profil_picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [pseudo, email, hashedPassword, salt, new Date(), JSON.stringify({}), generateProfilPicture()]
            );
            await fastify.db.query(
                'INSERT INTO chat_participant (chat_room_id,user_id) VALUES (?, ?)',
                [1, result.insertId]
            );
            reply.send({message: "User created successfully" });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                let message = 'Unknown error';
                if (error.sqlMessage.includes('email')) { //Check if the error is email already exists
                    message = 'Email already exists';
                } else if (error.sqlMessage.includes('pseudo')) { //Check if the error is pseudo already exists
                    message = 'Pseudo already exists';
                }
                reply.status(409).send({ error: message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: "An error occurred while creating the user" });
            }
        }
    });
}

export default registerRoutes;
