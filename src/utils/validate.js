export default {
  phone: validatePhone
}
function validatePhone(num) {
  var pattern = /^1(3|4|5|7|8)\d{9}$/;
  return pattern.test(num);
}