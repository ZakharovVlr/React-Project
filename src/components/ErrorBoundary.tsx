import HawkCatcher from '@hawk.so/javascript';
import { Component } from 'react';

import type { ErrorInfo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

const hawk = new HawkCatcher({
  token:
    'eyJpbnRlZ3JhdGlvbklkIjoiMTJjMGJjN2YtZTZiNC00MGM5LTgyODktYzI2NDBlYTBhNTEyIiwic2VjcmV0IjoiYzQ2ODVhOWItNjJjYi00MjEyLThlNTEtMTNiYjhhNWI3YWE3In0=',
});

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    hawk.send(error, { componentStack: info.componentStack ?? '' });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section className='error-boundary'>
          <h1>Что-то пошло не так</h1>
          <p>Попробуйте перезагрузить страницу.</p>
        </section>
      );
    }
    return this.props.children;
  }
}
