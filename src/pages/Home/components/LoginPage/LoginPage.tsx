import './loginPage.scss';

import { UserAuthorisation } from '../../components/UserAuthorisation/UserAuthorisation';

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
