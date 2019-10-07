import React from 'react';
import { ImageRequireSource, AsyncStorage } from 'react-native';
import { Themestate } from './components/common/themes/favorites.container';
import { NavigationState } from 'react-navigation';
import { mapping } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { DynamicStatusBar } from '../src/components/common';
import {
  ApplicationLoader,
  Assets,
} from './core/appLoader/applicationLoader.component';
import { Router } from './core/navigation/routes';
import { trackScreenTransition } from './core/utils/analytics';
import { getCurrentStateName } from './core/navigation/util';
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
} from '../src/core/themes';

const prod = 'https://prototype.iotnxt.io';
const dev = 'https://prototype.dev.iotnxt.io';
const newDev = 'https://8bo.org';
const v3 = 'v3'; // prod or dev
const v4 = 'v4'; // 8bo site
export let url = dev;
export let version = v3;
export let theme: { backgroundColor: any; backgroundColor2: any; color: any; value?: boolean; };
const images: ImageRequireSource[] = [

];

const fonts: { [key: string]: number } = {
  'ShareTechMono-Regular': require('./assets/fonts/ShareTechMono-Regular.ttf'),
};

const assets: Assets = {
  images: images,
  fonts: fonts,
};

interface State {
  theme: ThemeKey;
}

export default class App extends React.Component<{}, State> {
  UNSAFE_componentWillMount() {
    this.getTheme();
  }

  componentDidMount() {
    setInterval(() =>
      this.changeTheme()
      , 5000);
  }

  changeTheme = () => {
    if (Themestate) {
      theme = Themestate;
    }
  }

  getTheme = async () => {
    const storedtheme = await AsyncStorage.getItem('Theme');
    if (!storedtheme || storedtheme == null) {
      theme = Themestate;
    } else {
      theme = JSON.parse(storedtheme);
    }
  }
  public state: State = {
    theme: 'The Dark Side',
  };

  private onTransitionTrackError = (error: any): void => {
    console.warn('Analytics error: ', error.message);
  };

  private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    const prevStateName: string = getCurrentStateName(prevState);
    const currentStateName: string = getCurrentStateName(currentState);

    if (prevStateName !== currentStateName) {
      trackScreenTransition(currentStateName)
        .catch(this.onTransitionTrackError);
    }
  };

  // tslint:disable-next-line: no-shadowed-variable
  private onSwitchTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      this.setState({ theme });
    });
  };

  public render(): React.ReactNode {
    const contextValue: ThemeContextType = {
      currentTheme: this.state.theme,
      toggleTheme: this.onSwitchTheme,
    };

    return (
      <ApplicationLoader assets={assets}>
        <ThemeContext.Provider value={contextValue}>
          <ApplicationProvider
            mapping={mapping}
            theme={themes[this.state.theme]}>
            <DynamicStatusBar currentTheme={this.state.theme} />
            <Router onNavigationStateChange={this.onNavigationStateChange} />
          </ApplicationProvider>
        </ThemeContext.Provider>
      </ApplicationLoader>
    );
  }
}
