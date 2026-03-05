import { toast } from 'sonner';
import { useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetUserDetails } from 'src/actions/dashboard/user';

import { LoadingScreen } from 'src/components/loading-screen';

import { NotFoundView } from 'src/sections/error';
import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { user, userError, userIsLoading } = useGetUserDetails(id);

  // Show error toast only once
  useEffect(() => {
    if (userError) {
      toast.error(userError.message || 'Failed to load user');
    }
  }, [userError]);

  // 1️⃣ Loading
  if (userIsLoading) {
    return <LoadingScreen />;
  }

  // 2️⃣ Error
  if (userError) {
    return (
      <>
        <title>{metadata.title}</title>
        <NotFoundView
          title="User not found!"
          description="Sorry, we could not find the user, perhaps you entered a wrong user ID, please choose a valid user."
        />
      </>
    );
  }

  // 3️⃣ User not found (null/undefined)
  if (!user) {
    return (
      <>
        <title>{metadata.title}</title>
        <NotFoundView
          title="Please choose a user!"
          description="Sorry, you did not choose any user, you can choose a user by going to users list."
        />
      </>
    );
  }

  // 4️⃣ Success
  return (
    <>
      <title>{metadata.title}</title>
      <UserEditView user={user} />
    </>
  );
}
