import React from 'react';
import {
  View,
  ViewProps,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  textStyle,
  ValidationInput,
} from '@src/components/common';
import { EmailIconFill } from '@src/assets/icons';
import { EmailValidator } from '@src/core/validators';
import { ForgotPasswordFormData } from './type';


interface ComponentProps {
  /**
   * Will emit changes depending on validation:
   * Will be called with form value if it is valid, otherwise will be called with undefined
   */
  onDataChange: (value: ForgotPasswordFormData | undefined) => void;
}


export type ForgotPasswordFormProps = ThemedComponentProps & ViewProps & ComponentProps;

interface State {
  email: string | undefined;
}

class ForgotPasswordFormComponent extends React.Component<ForgotPasswordFormProps, State> {

  public state: State = {
    email: undefined,
  };

  public componentDidUpdate(prevProps: ForgotPasswordFormProps, prevState: State) {
    const oldFormValid: boolean = this.isValid(prevState);
    const newFormValid: boolean = this.isValid(this.state);

    const isStateChanged: boolean = this.state !== prevState;
    const becomeValid: boolean = !oldFormValid && newFormValid;
    const becomeInvalid: boolean = oldFormValid && !newFormValid;
    const remainValid: boolean = oldFormValid && newFormValid;

    if (becomeValid) {
      this.props.onDataChange(this.state);
    } else if (becomeInvalid) {
      this.props.onDataChange(undefined);
    } else if (isStateChanged && remainValid) {
      this.props.onDataChange(this.state);
    }
  }

  private onEmailInputTextChange = (email: string) => {
    this.setState({ email });
  };

  private isValid = (value: ForgotPasswordFormData): boolean => {
    const { email } = value;

    return email !== undefined;
  };

  public render(): React.ReactNode {
    const { style, themedStyle, ...restProps } = this.props;

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}>
        <ValidationInput
          style={{ backgroundColor: "#262626" }}
          textStyle={textStyle.paragraph}
          placeholder='Email'
          icon={EmailIconFill}
          validator={EmailValidator}
          onChangeText={this.onEmailInputTextChange}
        />
      </View>
    );
  }
}

export const ForgotPasswordForm = withStyles(ForgotPasswordFormComponent, (theme: ThemeType) => ({
  container: {},
}));
