module.exports = function sendSignUpAlertEmail(ctx, { user }) {
  return ctx.sendMail('sign-up-alert', { to: user.email, subject: 'Bienvenido a Travel&Plan' }, { user });
};
