import router from '../router';
import * as controller from '../controller';

router.get('/', controller.home);

router.put('/stream/:streamId', controller.registerStream);

router.delete('/stream/:streamId', controller.unregisterStream);
