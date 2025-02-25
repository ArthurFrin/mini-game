import type { TuPreferes } from '../../interfaces/TuPreferes';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {getPrepromptTheme, generateAndStoreImage} from '../../utils/generateImg.utils';

async function postRoutes(fastify: FastifyInstance) {

//use onRequest hook to verify jwt token
    fastify.addHook('onRequest', async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      });
    //create a new tu_preferes
    fastify.post('/',{ config: { timeout: 600000 } }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const newPost: TuPreferes = request.body as TuPreferes;
            const theme = getPrepromptTheme();
            newPost.img_url1 = await generateAndStoreImage(`Génere une image de ${newPost.prompt1} dans le style de ${theme}`);
            newPost.img_url2 = await generateAndStoreImage(`Génere une image de ${newPost.prompt2} dans le style de ${theme}`);
            await fastify.db.query(
                'INSERT INTO tu_preferes (prompt1, img_url1, nb_clic1, prompt2, img_url2, nb_clic2, author_id, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                [newPost.prompt1, newPost.img_url1, newPost.nb_clic1, newPost.prompt2, newPost.img_url2, newPost.nb_clic2, newPost.author_id, new Date()]
            );
            reply.send({ img_url1: newPost.img_url1, img_url2: newPost.img_url2 });
        } catch (error) {
            request.log.error(error);
            reply.status(500).send({ error: "An error occurred while creating the post" });
        }
    });
}

export default postRoutes;
