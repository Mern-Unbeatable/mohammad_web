import { Link, Outlet, useLocation } from 'react-router';
import logo from '@/assets/logo.png';
import Container from '@/components/ui/Container';

const AuthLayout = () => {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[#ECEEF2] bg-white">
        <Container className="flex h-[72px] items-center justify-between">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="Lab Unity"
              className="h-[38px] w-auto object-contain lg:h-[42px]"
            />
          </Link>

          <p className="text-[13px] text-[#64748B] sm:text-[14px]">
            {isLogin ? (
              <>
                New here?{' '}
                <Link to="/join" className="font-medium text-primary hover:underline">
                  Join Lab Unity
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </>
            )}
          </p>
        </Container>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
