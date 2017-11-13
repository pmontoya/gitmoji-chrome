import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fuzz from 'fuzzaldrin-plus';
import { fetchEmojis } from '../../store/emojis/actions';
import { addRecent } from '../../store/recent/actions';
import { copy } from '../../store/messages/actions';
import * as types from '../../propTypes';
import EmojiPreviewContainer from './EmojiPreviewContainer';
import EmojiPreview from './EmojiPreview';

class EmojiList extends PureComponent {
  static propTypes = {
    emojis: PropTypes.arrayOf(types.emoji).isRequired,
    filter: PropTypes.string.isRequired,
    fetchEmojis: PropTypes.func.isRequired,
    addRecent: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchEmojis();
  }

  handleClick = emoji => {
    this.props.addRecent(emoji);
    this.props.copy(emoji);
  };

  render() {
    const { emojis } = this.props;
    return (
      <EmojiPreviewContainer>
        {emojis.map(emoji => (
          <EmojiPreview
            key={emoji.name}
            emoji={emoji}
            onClick={this.handleClick}
          />
        ))}
      </EmojiPreviewContainer>
    );
  }
}

const fuzzyFilter = (items, input) => {
  const filtered = fuzz.filter(items, input, { key: 'filterKey' });
  return filtered;
};

const mapStateToProps = (state, props) => {
  const { filter } = props;
  const { items } = state.emojis;
  return {
    emojis: filter ? fuzzyFilter(items, filter) : items,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchEmojis, addRecent, copy }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EmojiList);
