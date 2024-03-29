import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import _ from 'lodash';
import FontIcon from 'material-ui/lib/font-icon';
import FlatButton from 'material-ui/lib/flat-button';
import DealComment from './DealComment';
import { values, range } from '../utils/helpers';
import { call, getLocal } from '../intent';
import Combinator from './Combinator';

const styles = {
  title: {
    display: 'none',
    '@media (min-width: 740px)': {
      display: 'block',
      fontSize: '18px',
      color: '#666',
      borderBottom: '1.5px solid rgba(0,0,0,0.12)',
      paddingBottom: '5px'
    }
  }
};

class DealComments extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    comments: React.PropTypes.object,
    fetch: React.PropTypes.func
  };
  static contextTypes = {
    model$: React.PropTypes.any,
    lock: React.PropTypes.object
  };
  constructor() {
    super();
    this.state = {
      comments: []
    };
  }

  onCommentKeyPress(e) {
    if (e.keyCode === 13 && this.comment.value !== '') {
      this.postComment();
      this.comment.value = '';
    }
  }
  static queries = () => ({
    id: null,
    comments: {
      'sort:createdAt=desc': {
        edges: {
          ...range(0, 10, {
            id: null,
            ...DealComment.queries()
          })
        }
      }
    }
  });
  postComment() {
    const comment = this.comment.value;
    if (comment !== '') {
      this.commentsHeight = ReactDOM.findDOMNode(this.comments).offsetHeight;
      call(['comments', 'create'], [{
        text: comment,
        idDeal: this.props.id
      }], ['text'], [], this.props.fetch);
      this.comment.value = '';
    }
  }
  render() {
    return (
      <div>
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          background: 'white',
          margin: '10px 10px 0 10px',
          '@media (min-width: 740px)': { margin: '10px 10px 0 0' }
        }}
        >
          <div style = {styles.title}>
            <FontIcon className="material-icons" style = {{ fontSize: '14px' }}>
              chat_bubble_outline</FontIcon>
            <span style = {{ paddingLeft: '5px' }}>Комментарии</span>
          </div>
          <div ref={el => this.comments = el}>
            {
              this.props.comments ?
              Array.reverse(values(_.get(this.props.comments, ['sort:createdAt=desc', 'edges']))).
                map(comment => (
                  <div key={`${comment.id}`}>
                    <DealComment {..._.pick(comment, Object.keys(DealComment.queries()))} />
                  </div>
                ))
              :
              <div style={{ height: this.commentsHeight + 'px' }}></div>
            }
          </div>
        </div>
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          color: '#a99999',
          margin: '10px 10px 10px 0',
          padding: '10px',
          background: '#fff'
        }}
        >
          <textarea
            type="text"
            ref={el => this.comment = el}
            onKeyDown={this.onCommentKeyPress.bind(this)}
            placeholder="Что вы думаете об этой сделке?" rows= "2"
            style = {{
              border: 'solid 1px #dcdcdc',
              width: '95%',
              height: '75px',
              margin: '10px 0',
              paddingLeft: '2%',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '3px'
            }}
          />
          <div style = {{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 10px'
          }}
          >
            Поделись!
            <Combinator>
              {
                this.context.model$.getData(['loggedIn'], ['loggedIn'], false).
                map(loggedIn => console.log(loggedIn) || (
                  <FlatButton
                    onClick = {loggedIn ? this.postComment.bind(this) : () => this.context.lock.show()}
                    style = {{ width: '28px',
                      minWidth: '28px'
                    }}
                  >
                    <FontIcon className="material-icons"
                              color = "#a99999"
                              style = {{ fontSize: '18px' }}
                    >chat_bubble_outline</FontIcon>
                  </FlatButton>
                ))
              }
            </Combinator>
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(DealComments);
