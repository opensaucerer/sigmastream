import router from '../router';
import * as controller from '../controller';

router.get('/', controller.home);

router.put('/stream/:userId/:streamId', controller.registerStream);

router.delete('/stream/:userId/:streamId', controller.unregisterStream);
