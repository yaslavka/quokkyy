import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {isValidEmail, isValidPassword, isValidPhone} from '../../utils';
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
function SignUpScreen() {
  const {t, i18n} = useTranslation('common');
  const navigation = useNavigation();
  const [signUpStatus, setSignUpStatus] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [state, setState] = useState({
    phone: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const {first_name, last_name, phone, email, password, repeatPassword} = state;
  const errors = {};
  if (repeatPassword !== password) {
    errors.repeatPassword = `${t(
      'signInPage.signUpPage.inputs.repeatPassword.error',
    )}`;
  }
  if (!isValidPassword(password)) {
    errors.password = `${t('signInPage.signUpPage.inputs.password.error')}`;
  }
  if (!isValidPhone(phone)) {
    errors.phone = `${t('signInPage.signUpPage.inputs.phone.error')}`;
  }
  if (!isValidEmail(email)) {
    errors.email = `${t('signInPage.signUpPage.inputs.email.error')}`;
  }
  if (!first_name.trim()) {
    errors.first_name = `${t('signInPage.signUpPage.inputs.firstName.error')}`;
  }

  if (!last_name.trim()) {
    errors.last_name = `${t('signInPage.signUpPage.inputs.lastName.error')}`;
  }
  const options = [
    {label: 'EN', value: 'en'},
    {label: 'DE', value: 'de'},
  ];
  const handleOnchanges = (text, input) => {
    setState(prevState => ({...prevState, [input]: text}));
  };
  const handleOnSubmit = () => {
    setSignUpStatus('progress');
    setServerError(null);
    api
      .signUp({
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        password: password,
      })
      .then(() => {
        setSignUpStatus('successful');
      })
      .catch(response => {
        setServerError(response.message);
        setSignUpStatus('failed');
      });
  };
  // TODO: refactoring
  if (signUpStatus === 'successful') {
    return navigation.navigate('Auth');
  }
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
          <StyledView className=" ">
            <StyledView className="">
              <StyledView className="flex flex-col px-10">
                <StyledTextInput
                  placeholderTextColor="#090a0a"
                  style={{borderColor: 'rgb(70,85,31)'}}
                  className="px-6 h-14 w-40 mb-6 text-black transition-all border-2 border-solid  rounded-md w-full focus:outline-none"
                  onChangeText={text => handleOnchanges(text, 'first_name')}
                  placeholder={t(
                    'signInPage.signUpPage.inputs.firstName.placeholder',
                  )}
                />
                {errors && (
                  <Text style={styles.label}>{errors.first_name}</Text>
                )}
                <StyledTextInput
                  placeholderTextColor="#090a0a"
                  style={{borderColor: 'rgb(70,85,31)'}}
                  className="px-6 h-14 w-40 mb-6 text-black transition-all border-2 border-solid  rounded-md w-full focus:outline-none"
                  onChangeText={text => handleOnchanges(text, 'last_name')}
                  placeholder={t(
                    'signInPage.signUpPage.inputs.lastName.placeholder',
                  )}
                />
                {errors && <Text style={styles.label}>{errors.last_name}</Text>}
                <StyledTextInput
                  placeholderTextColor="#090a0a"
                  style={{borderColor: 'rgb(70,85,31)'}}
                  className="px-6 h-14 w-40 mb-6 text-black transition-all border-2 border-solid  rounded-md w-full focus:outline-none"
                  onChangeText={text => handleOnchanges(text, 'phone')}
                  placeholder={t(
                    'signInPage.signUpPage.inputs.phone.placeholder',
                  )}
                />
                {errors && <Text style={styles.label}>{errors.phone}</Text>}
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
                <StyledTextInput
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
                <StyledTextInput
                  style={{borderColor: 'rgb(70,85,31)'}}
                  placeholderTextColor="#090a0a"
                  className="px-6 h-14 w-40 mb-6 text-black transition-all border-2 border-solid  rounded-md w-full focus:outline-none"
                  onChangeText={text => handleOnchanges(text, 'repeatPassword')}
                  secureTextEntry={true}
                  placeholder={t(
                    'signInPage.signUpPage.inputs.repeatPassword.placeholder',
                  )}
                />
                {errors && (
                  <Text style={styles.label}>{errors.repeatPassword}</Text>
                )}
                <TouchableOpacit
                  onPress={handleOnSubmit}
                  disabled={
                    repeatPassword !== password ||
                    !phone ||
                    !first_name ||
                    !email ||
                    !last_name ||
                    password < 8
                  }
                  block
                  text={t('signInPage.signUpPage.buttons.signUp')}
                />
                <TouchableOpacit
                  onPress={() => {
                    navigation.navigate('Auth');
                  }}
                  block
                  text={t('signInPage.signUpPage.links.signIn')}
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
export default SignUpScreen;
