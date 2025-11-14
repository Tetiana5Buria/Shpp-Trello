import './loginPage.scss';

import { UserAuthorisation } from '../../Auth/UserAuthorisation/UserAuthorisation';

const LoginPage = () => {
  return (
    <>
      <div className="login-page">
        <UserAuthorisation />
      </div>
    </>
  );
};

export default LoginPage;
