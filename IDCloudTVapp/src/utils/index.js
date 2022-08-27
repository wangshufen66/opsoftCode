import {useAsyncStorage} from '@react-native-community/async-storage';

export async function getToken() {
  const {getItem} = useAsyncStorage('@accessToken');
  const token = await getItem();
  return token || undefined;
}

export function setToken(val) {
  const {setItem} = useAsyncStorage('@accessToken');
  return setItem(val);
}

export function removeToken(val) {
  const {removeItem} = useAsyncStorage('@accessToken');
  removeItem();
}

export function setStorage(key, val) {
  const {setItem} = useAsyncStorage(`@${key}`);
  setItem(val + '');
}

export function getStorage(key) {
  const {getItem} = useAsyncStorage(`@${key}`);
  return getItem();
}

export function removeStorage(key) {
  const {removeItem} = useAsyncStorage(`@${key}`);
  removeItem();
}
