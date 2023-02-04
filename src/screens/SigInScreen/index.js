import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {isValidEmail, isValidPassword, setAccessToken} from '../../utils';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Background from '../../assets/images/splash.png';
import TouchableOpacit from '../../Components/ButtonWithLoader/TouchableOpacity';
import SwitchSelector from 'react-native-switch-selector';
import {api} from '../../api';
import {useTranslation} from 'react-i18next';
import {styled} from 'nativewind';
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyImageBackground = styled(Image);
import * as actions from '../../actions/auth.actions';
function SignInScreen() {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation('common');
  const navigation = useNavigation();
  const [signUpStatus, setSignUpStatus] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const {email, password} = state;
  const errors = {};
  if (!isValidPassword(password)) {
    errors.password = `${t('signInPage.signUpPage.inputs.password.error')}`;
  }
  if (!isValidEmail(email)) {
    errors.email = `${t('signInPage.signUpPage.inputs.email.error')}`;
  }
  const options = [
    {label: 'EN', value: 'en'},
    {label: 'DE', value: 'de'},
  ];
  const handleOnchanges = (text, input) => {
    setState(prevState => ({...prevState, [input]: text}));
  };
  const submitSignInForm = async () => {
    const valid = isValidPassword(password);
    if (valid) {
      setServerError();
      await api
        .signIn({email: email, password: password})
        .then(async response => {
          dispatch(actions.signInSuccess());
          await setAccessToken(response);
          setSignUpStatus('successful');
          await api
            .getUserInfo()
            .then(() => {})
            .catch(() => {});
        })
        .catch(response => {
          setServerError(response.message);
          setSignUpStatus('failed');
        });
    }
  };
  // TODO: refactoring
  // if (signUpStatus === 'successful') {
  //   return navigation.navigate('Dashboard');
  // }
  return (
    <View style={styles.container}>
      <SwitchSelector
        options={options}
        initial={0}
        onPress={value => {
          i18n.changeLanguage(value).then(() => {});
        }}
      />
      <StyImageBackground source={Background} className=" w-40  h-40" />
      <>
        <ScrollView style={{width: '100%'}}>
          <StyledView>
            <StyledView>
              <StyledView className="flex flex-col px-10">
                <StyledTextInput
                  placeholderTextColor="#090a0a"
                  style={{borderColor: 'rgb(70,85,31)'}}
                  className="px-6 h-14 w-40 mb-6 text-black transition-all border-2 border-solid  rounded-md w-full focus:outline-none"
                  onChangeText={text => handleOnchanges(text, 'email')}
                  placeholder={t(
                    'signInPage.signUpPage.inputs.email.placeholder',
                  )}
                />
                {errors && <Text style={styles.label}>{errors.email}</Text>}
                <TextInput
                  placeholderTextColor="#090a0a"
                  style={{borderColor: 'rgb(70,85,31)'}}
                  className="px-6 h-14 w-40 mb-6 text-black  transition-all border-2 border-solid  rounded-md w-full focus:outline-none"
                  onChangeText={text => handleOnchanges(text, 'password')}
                  secureTextEntry={true}
                  placeholder={t(
                    'signInPage.signUpPage.inputs.password.placeholder',
                  )}
                />
                {errors && <Text style={styles.label}>{errors.password}</Text>}
                <TouchableOpacit
                  onPress={submitSignInForm}
                  block
                  text={t('signInPage.buttons.signIn')}
                />
                <TouchableOpacit
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}
                  block
                  text={t('signInPage.links.signUp')}
                />
                {serverError && <Text style={styles.label}>{serverError}</Text>}
              </StyledView>
            </StyledView>
          </StyledView>
        </ScrollView>
      </>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'rgb(70,85,31)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default SignInScreen;
