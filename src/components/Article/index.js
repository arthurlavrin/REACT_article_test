import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {findDOMNode} from 'react-dom';
import CommentList from '../CommentList';
import { CSSTransitionGroup } from 'react-transition-group';
import './style.css';
import Loader from '../../components/Loader';
import {deleteArticle, loadArticle} from '../../AC'

class Article extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		isOpen: PropTypes.bool,
		toggleOpen: PropTypes.func,
		// from connect
		article: PropTypes.shape({
			text: PropTypes.string,
			title: PropTypes.string,
			id: PropTypes.string
		})
	};

	// shouldComponentUpdate(nextProps, nextState) {
	// 	return nextProps.isOpen !== this.props.isOpen
	// }

	state = {
		updateIndex: 0
	};

	componentDidMount() {
		const {loadArticle, article, id} = this.props;
		if (!article || (!article.text && !article.loading)) loadArticle(id)
	}

	render () {
		const {article, isOpen, toggleOpen} = this.props;
		if (!article) return null;
		return (
			<div ref = {this.setContainerRef}>
				<h3>{article.title}</h3>
				<button onClick={toggleOpen}>
					{isOpen ? 'close' : 'open'}
				</button>
				<button onClick={this.handleDelete}>delete me</button>
				<CSSTransitionGroup
					transitionName = 'article'
					transitionEnterTimeout = {300}
					transitionLeaveTimeout = {500}
				>
					{this.getBody()}
				</CSSTransitionGroup>
			</div>
		)
	}

	handleDelete = () => {
		const {deleteArticle, article} = this.props;
		deleteArticle(article.id);
	};

	setContainerRef = ref => {
		this.container = ref;
		// console.log('----', ref)
	};

	getBody() {
		const {article, isOpen} = this.props;
		if (!isOpen) return null;
		if (article.loading) return <Loader />
		return (
			<section>
				{article.text}
				<button onClick={() => this.setState({updateIndex: this.state.updateIndex + 1})}>update</button>
				<CommentList article = {article} ref = {this.setCommentRef} key = {this.state.updateIndex} />
			</section>
		)
	}

	setCommentRef = ref => {
		// console.log('----', findDOMNode(ref))
	}
}

export default connect((state, ownProps) => ({
	article: state.articles.entities.get(ownProps.id)
}),
	{ deleteArticle, loadArticle },
	null,
	{ pure: false }
)(Article);



