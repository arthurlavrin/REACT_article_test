import {arrToMap} from '../helpers'
import {DELETE_ARTICLE, ADD_COMMENT, LOAD_ALL_ARTICLES, START, SUCCESS, LOAD_ARTICLE, LOAD_ARTICLE_COMMENTS} from '../constants';
import {OrderedMap, Record} from 'immutable';

const ArticleRecord = Record({
	text: undefined,
	title: '',
	id: undefined,
	loading: false,
	commentsLoading: false,
	commentsLoaded: false,
	comments: []
});

const ReducerState = Record({
	loading: false,
	loaded: false,
	entities: new OrderedMap({})
});

const defaultState = new ReducerState();

export default (articlesState = defaultState, action) => {
	const {type, payload, response, randomId} = action;

	switch (type) {
		case DELETE_ARTICLE:
			return articlesState.deleteIn(['entities', payload.id]);

		case  ADD_COMMENT:
			return articlesState.updateIn(
				['entities', payload.articleId, 'comments'],
				comments => comments.concat(randomId)
			);

		case LOAD_ALL_ARTICLES + START:
			return articlesState.set('loading', true);

		case LOAD_ALL_ARTICLES + SUCCESS:
			return articlesState
				.set('entities', arrToMap(response, ArticleRecord))
				.set('loading', false)
				.set('loaded', true);

		case LOAD_ARTICLE + START:
			return articlesState.setIn(['entities', payload.id, 'loading'], true);

		case LOAD_ARTICLE + SUCCESS:
			return articlesState.setIn(['entities', payload.id], new ArticleRecord(payload.response));

		case LOAD_ARTICLE_COMMENTS + START:
			return articlesState.setIn(['entities', payload.articleId, 'commentsLoading'], true);

		case LOAD_ARTICLE_COMMENTS + SUCCESS:
			return articlesState
				.setIn(['entities', payload.articleId, 'commentsLoading'], false)
				.setIn(['entities', payload.articleId, 'commentsLoaded'], true)
	}

	return articlesState
}