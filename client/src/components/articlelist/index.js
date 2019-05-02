import React, {PureComponent} from 'react'
import {render} from 'react-dom'
import Article from '../article'
import './style.css'

class ArticleList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {...props, openedArticleId: null};
    }

    changeOpenedArticle = id => {
        this.setState({openedArticleId: (this.state.openedArticleId === id) ? null : id})
    }

    render() {
        return (
            <ul className={'article-list__li'}>
                {
                    this.state.articles.map((article, key) =>
                        <li key={article.id}>
                            <Article article={article} opened={article.id === this.state.openedArticleId}
                                     changeOpened={this.changeOpenedArticle}/>
                        </li>
                    )}
            </ul>
        )
    }
}

export default ArticleList