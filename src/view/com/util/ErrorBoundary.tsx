import {Component, type ErrorInfo, type ReactNode} from 'react'
import {type StyleProp, type ViewStyle} from 'react-native'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'

import {logger} from '#/logger'
import {ErrorScreen} from './error/ErrorScreen'
import {CenteredView} from './Views'

interface Props {
  children?: ReactNode
  renderError?: (error: any) => ReactNode
  style?: StyleProp<ViewStyle>
}

interface State {
  hasError: boolean
  error: any
  componentStack?: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
    componentStack: undefined,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error}
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep the React component stack around so the error screen can surface it
    // (and the user can copy it) - the message alone rarely pinpoints a crash.
    this.setState({componentStack: errorInfo.componentStack})
    logger.error(error, {errorInfo})
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.renderError) {
        return this.props.renderError(this.state.error)
      }

      return (
        <CenteredView style={[{height: '100%', flex: 1}, this.props.style]}>
          <TranslatedErrorScreen
            details={buildErrorDetails(
              this.state.error,
              this.state.componentStack,
            )}
          />
        </CenteredView>
      )
    }

    return this.props.children
  }
}

/**
 * Assemble a copyable details string: the full error stack (which includes the
 * message) plus the React component stack when available. Falls back to the
 * stringified error if no stack is present.
 */
function buildErrorDetails(error: any, componentStack?: string | null): string {
  const parts: string[] = []
  const stack = typeof error?.stack === 'string' ? error.stack : undefined
  parts.push(stack || String(error))
  if (componentStack) {
    parts.push('\nComponent stack:' + componentStack)
  }
  return parts.join('\n')
}

function TranslatedErrorScreen({details}: {details?: string}) {
  const {_} = useLingui()

  return (
    <ErrorScreen
      title={_(msg`Oh no!`)}
      message={_(
        msg`There was an unexpected issue in the application. Please let us know if this happened to you!`,
      )}
      details={details}
    />
  )
}
