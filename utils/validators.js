export function isPhoneValid(phone){
  if(!phone) return false;
  const digits = (phone+'').replace(/\D/g,'');
  return digits.length >= 10 && digits.length <= 15;
}
