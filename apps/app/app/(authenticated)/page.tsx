import { redirect } from 'next/navigation';

const App = async () => {
  // Redirect root path to dashboard
  redirect('/dashboard');
};

export default App;
