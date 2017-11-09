import { MESSAGE_SUCCESS, MESSAGE_ERROR, MESSAGE_REMOVE } from './constants';
import * as clipboard from '../../utils/clipboard';
import { send } from '../../utils/message';

const messageSuccess = ({ message, icon }) => {
  const action = {
    type: MESSAGE_SUCCESS,
    payload: { message, icon },
  };

  if (process.env.NODE_ENV !== 'production') {
    return dispatch => {
      console.log(`${icon || ''}${message}`);
      dispatch(action);
    };
  }

  return action;
};

const messageError = ({ message, icon }) => {
  const action = {
    type: MESSAGE_ERROR,
    payload: { message, icon },
  };

  if (process.env.NODE_ENV !== 'production') {
    return dispatch => {
      console.error(`${icon || ''}${message}`);
      dispatch(action);
    };
  }

  return action;
};

const removeMessage = message => ({ type: MESSAGE_REMOVE, payload: message });

const copy = emoji => async dispatch => {
  try {
    const success = clipboard.copy(emoji.code);

    if (!success) {
      const err = new Error(`Failed to copy ${emoji.code}! Sorry 🙄`);
      err.icon = emoji.emoji;
      throw err;
    }

    const message = `Eyy! ${emoji.code} is on your clipboard!`;
    const icon = emoji.emoji;
    dispatch(messageSuccess({ message, icon }));
  } catch (e) {
    const { message, icon } = e;
    dispatch(messageError({ message, icon }));
  }

  try {
    await send({ emoji });
  } catch (e) {
    return;
  }
};

export { messageError, messageSuccess, removeMessage, copy };
