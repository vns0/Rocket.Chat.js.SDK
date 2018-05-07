import 'mocha'
import sinon from 'sinon'
import { expect } from 'chai'
import { silence, logger } from './log'
const initEnv = process.env // store configs to restore after tests
import { botUser, mockUser } from '../utils/config'
process.env.ROCKETCHAT_USER = botUser.username
process.env.ROCKETCHAT_PASSWORD = botUser.password
import * as utils from '../utils/testing'
import * as driver from './driver'
import * as api from './api'

silence() // suppress log during tests (disable this while developing tests)

describe('api', () => {
  before(() => driver.connect()) // wait for connection
  after(() => process.env = initEnv)
  afterEach(() => api.logout())
  describe('.success', () => {
    it('returns true when result status is success', () => {
      expect(api.success({ status: 'success' })).to.equal(true)
    })
    it('returns true when success is true', () => {
      expect(api.success({ success: true })).to.equal(true)
    })
    it('returns false when result status is not success', () => {
      expect(api.success({ status: 'error' })).to.equal(false)
    })
    it('returns false when success is not true', () => {
      expect(api.success({ success: false })).to.equal(false)
    })
    it('returns true if neither status or success given', () => {
      expect(api.success({})).to.equal(true)
    })
  })
  describe('.getQueryString', () => {
    it('converts object to query params string', () => {
      expect(api.getQueryString({
        foo: 'bar',
        baz: 'qux'
      })).to.equal('?foo=bar&baz=qux')
    })
    it('returns empty if nothing in object', () => {
      expect(api.getQueryString({})).to.equal('')
    })
    it('returns nested objects without serialising', () => {
      expect(api.getQueryString({
        fields: { 'username': 1 }
      })).to.equal('?fields={"username":1}')
    })
  })
  describe('.get', () => {
    it('returns data from basic call without auth', async () => {
      const server = await driver.callMethod('getServerInfo')
      const result = await api.get('info', {}, false)
      expect(result).to.eql({
        info: { version: server.version },
        success: true
      })
    })
    it('returns data from complex calls with auth and parameters', async () => {
      await api.login()
      const result = await api.get('users.list', {
        fields: { 'username': 1 }
      }, true)
      const users = result.users.map((user) => user.username)
      expect(users).to.include(botUser.username, mockUser.username)
    })
  })
  describe('.login', () => {
    it('logs in with the bot user by default', async () => {
      const botId = await driver.login(api.credentials)
      const login = await api.login()
      expect(login.data.userId).to.equal(botId)
    })
    it('logs in with another user if given credentials', async () => {
      const credentials = {
        username: mockUser.username,
        password: mockUser.password
      }
      const userId = await driver.login(credentials)
      await api.login(credentials)
      expect(api.currentLogin.userId).to.equal(userId)
    })
    it('stores logged in user result', async () => {
      const botId = await driver.login(api.credentials)
      await api.login()
      expect(api.currentLogin.userId).to.equal(botId)
    })
    it('stores user and token in auth headers', async () => {
      const botId = await driver.login(api.credentials)
      await api.login()
      expect(api.authHeaders['X-User-Id']).to.equal(botId)
      expect(api.authHeaders['X-Auth-Token']).to.have.lengthOf(43)
    })
  })
  describe('.logout', () => {
    it('resets auth headers and clears user ID', async () => {
      await api.login().catch(e => console.log('login error', e))
      await api.logout().catch(e => console.log('logout error', e))
      expect(api.authHeaders).to.eql({})
      expect(api.currentLogin).to.eql(null)
    })
  })
  describe('.getHeaders', () => {
    beforeEach(() => api.clearHeaders())
    it('returns headers for API call', () => {
      expect(api.getHeaders()).to.eql({
        'Content-Type': 'application/json'
      })
    })
    it('should fail if called before login when auth required', () => {
      expect(() => api.getHeaders(true)).to.throw()
    })
    it('should return auth headers if required when logged in', async () => {
      api.authHeaders['X-User-Id'] = 'test'
      api.authHeaders['X-Auth-Token'] = 'test'
      expect(api.getHeaders(true)).to.eql({
        'Content-Type': 'application/json',
        'X-User-Id': 'test',
        'X-Auth-Token': 'test'
      })
    })
  })
})
