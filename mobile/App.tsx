import { NativeBaseProvider, StatusBar, Text } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from './src/styles/theme';
import { Loading } from './components/Loading';
import { SignIn } from './screens/SignIn';

export default function App() {
  const [fonstLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />

      {fonstLoaded ? <SignIn /> : <Loading />}
    </NativeBaseProvider>
  );
}
