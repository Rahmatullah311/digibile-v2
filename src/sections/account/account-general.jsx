import { toast } from 'sonner';
import { useEffect } from 'react';

import { useParams } from 'src/routes/hooks';

import { useGetUserDetails } from 'src/actions/dashboard/user';

import { LoadingScreen } from 'src/components/loading-screen';

import { NotFoundView } from '../error';
import { UserEditForm } from '../user/user-edit-form';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function AccountGeneral() {
  // const { user } = useMockedUser();
  const { id } = useParams();
  const { user, userError, userIsLoading, mutateUser } = useGetUserDetails(id);

  useEffect(() => {
    mutateUser();
    if (userError) {
      toast.error(userError.message || 'Failed to load user');
    }
  }, [user, mutateUser, userError]);

  if (userError) {
    return (
      <NotFoundView
        title="User not found!"
        description="Sorry, we could not find the user, perhaps you entered a wrong user ID, please choose a valid user."
      />
    );
  }

  return userIsLoading ? <LoadingScreen /> : <UserEditForm currentUser={user} />;
}
