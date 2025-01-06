import 'mocha';
import { expect } from 'chai';
import { Message } from './message';

describe('Message class (two formats for `bot`)', () => {
  describe('constructor with { useLegacyBotFormat: true }', () => {
    it('creates a message from a string in legacy mode', () => {
      const message = new Message('hello world', 'test', { useLegacyBotFormat: true });
      expect(message.msg).to.equal('hello world');
      expect(message.bot).to.deep.equal({ i: 'test' });
    });

    it('accepts an existing message object in legacy mode', () => {
      const messageObj = { msg: 'hello world', rid: 'GENERAL' };
      const message = new Message(messageObj, 'test', { useLegacyBotFormat: true });
      expect(message).to.eql({
        msg: 'hello world',
        rid: 'GENERAL',
        bot: { i: 'test' },
      });
    });
  });

  describe('constructor without useLegacyBotFormat (new behavior)', () => {
    it('creates a message from a string -> bot = true', () => {
      const message = new Message('hello world', 'test');
      expect(message.msg).to.equal('hello world');
      expect(message.bot).to.equal(true);
    });

    it('accepts an existing message object -> bot = true', () => {
      const messageObj = { msg: 'hello world', rid: 'GENERAL' };
      const message = new Message(messageObj, 'test');
      expect(message).to.eql({
        msg: 'hello world',
        rid: 'GENERAL',
        bot: true,
      });
    });
  });

  describe('.setRoomId', () => {
    it('sets the rid property', () => {
      const message = new Message('hello world', 'test');
      message.setRoomId('111');
      expect(message.rid).to.equal('111');
    });

    it('updates the rid property for an existing message', () => {
      const messageObj = { msg: 'hello world', rid: 'GENERAL' };
      const message = new Message(messageObj, 'test');
      message.setRoomId('111');
      expect(message.rid).to.equal('111');
    });

    it('returns the message instance', () => {
      const message = new Message('hello world', 'test');
      expect(message.setRoomId('111')).to.equal(message);
    });
  });
});
