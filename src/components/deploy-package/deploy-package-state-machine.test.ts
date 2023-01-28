import { stateMachine } from './deploy-package-state-machine'

describe('#deploy state machine', () => {
  it('should transition from not-connected to connected', () => {
    expect(
      stateMachine.transition('not-connected', 'CONNECT').matches('connected')
    ).toBeTruthy()
  })

  describe('selecting account', () => {
    it('should transition from idle to selected', () => {
      expect(
        stateMachine
          .transition({ connected: 'selecting-account' }, 'SELECT_ACCOUNT')
          .matches({ connected: { 'selecting-account': 'selected' } })
      ).toBeTruthy()
    })
  })

  describe('uploading files', () => {
    it('should transition from idle to uploading', () => {
      expect(
        stateMachine
          .transition(
            { connected: { 'uploading-files': 'idle' } },
            'UPLOAD_FILES'
          )
          .matches({ connected: { 'uploading-files': 'uploading' } })
      ).toBeTruthy()
    })
  })

  describe('selecting badge', () => {
    it('should transition from idle to selected', () => {
      expect(
        stateMachine
          .transition(
            {
              connected: {
                'selecting-badge': 'idle'
              }
            },
            'SELECT_BADGE'
          )
          .matches({
            connected: {
              'selecting-badge': 'selected'
            }
          })
      ).toBeTruthy()
    })
  })

  describe('uploading-files', () => {
    it('should transition from idle to uploading', () => {
      expect(
        stateMachine
          .transition(
            {
              connected: {
                'uploading-files': 'idle'
              }
            },
            'UPLOAD_FILES'
          )
          .matches({
            connected: {
              'uploading-files': 'uploading'
            }
          })
      ).toBeTruthy()
    })
  })
})
