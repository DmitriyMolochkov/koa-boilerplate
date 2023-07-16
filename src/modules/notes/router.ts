import Router from '@koa/router';

import businessErrorHandler from '#modules/common/middlewares/business-error-handler';
import {
  validateBody,
  validatePathParams,
  validateQuery,
} from '#modules/common/middlewares/validators';
import { IdParam } from '#modules/common/models';
import * as NoteController from '#modules/notes/controllers';
import { ExampleNoteError } from '#modules/notes/error/business-errors/ExampleNoteError';
import { exampleErrorHandler } from '#modules/notes/error/http-handlers';
import {
  NoteCreateModel,
  NotePatchModel,
  NoteQuery,
  NoteUpdateModel,
} from '#modules/notes/models';
import { NoteQueryByPage } from '#modules/notes/models/NoteQueryByPage';

const router = new Router({ prefix: '/notes' });

router
  .use(businessErrorHandler((error) => {
    if (error instanceof ExampleNoteError) {
      return exampleErrorHandler(error);
    }

    return undefined;
  }));

router
  .get('/', validateQuery(NoteQuery), NoteController.array)
  .get('/list', validateQuery(NoteQueryByPage), NoteController.list)
  .get('/example-server-error', NoteController.exampleServerError)
  .get('/:id', validatePathParams(IdParam), NoteController.entity)
  .post('/', validateBody(NoteCreateModel), NoteController.create)
  .put('/:id', validatePathParams(IdParam), validateBody(NoteUpdateModel), NoteController.update)
  .patch('/:id', validatePathParams(IdParam), validateBody(NotePatchModel), NoteController.patch)
  .delete('/:id', validatePathParams(IdParam), NoteController.remove)
  .post('/:id/activate', validatePathParams(IdParam), NoteController.activate)
  .post('/:id/deactivate', validatePathParams(IdParam), NoteController.deactivate)
  .get('/:id/example-error', validatePathParams(IdParam), NoteController.exampleError);

export default router;
