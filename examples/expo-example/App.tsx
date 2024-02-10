// https://github.com/facebook/hermes/issues/817
// NOTE this fixes metro not logging objects/arrays for some reason
if (__DEV__) {
  const primitiveTypes = ['string', 'number', 'boolean'];
  const logLevels = ['log', 'debug', 'info', 'warn', 'error'];

  const transformArgs = (args) => {
    return args.map((arg) => {
      if (arg === undefined) {
        return 'undefined';
      }
      if (arg instanceof Error) {
        if (arg.stack) {
          return arg.stack;
        }
        return arg.toString();
      }
      if (arg instanceof Date) {
        return arg.toString();
      }
      if (primitiveTypes.includes(typeof arg)) {
        return arg.toString();
      } else {
        return JSON.stringify(arg);
      }
    });
  };

  const consoleProxy = new Proxy(console, {
    get: (target, prop) => {
      //@ts-ignore
      if (logLevels.includes(prop)) {
        return (...args) => {
          // we proxy the call to itself, but we transform the arguments to strings before
          // so that they are printed in the terminal
          return target[prop].apply(this, transformArgs(args));
        };
      }
      return target[prop];
    },
  });

  console = consoleProxy;
}

import { Text, View } from 'react-native';
import Constants from 'expo-constants';

function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>didn't get storybook enabled flag</Text>
    </View>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig?.extra?.storybookEnabled === 'true') {
  AppEntryPoint = require('./.storybook').default;
}

export default AppEntryPoint;
