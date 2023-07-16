import { PaginationMixin } from '#mixins';
import { BaseQuery } from '#modules/common/models/BaseQuery';

export class QueryByPage extends PaginationMixin(BaseQuery) {
}
