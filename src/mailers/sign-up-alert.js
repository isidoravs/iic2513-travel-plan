module.exports = function sendSignUpAlertEmail(ctx, { user }) {
  return ctx.sendMail('sign-up-alert', { to: 'fjlarach@uc.cl', subject: 'Alert!' }, { user });
};
