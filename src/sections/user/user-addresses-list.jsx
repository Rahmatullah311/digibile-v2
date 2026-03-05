import { toast } from 'sonner';
import { useParams } from 'react-router';
import React, { useEffect } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetUserAddresses } from 'src/actions/dashboard/user';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { AddressItem } from '../address';

const UserAddressesList = () => {
  const { id } = useParams();
  const { addresses, addressesError, addressesIsLoading, mutateAddresses } =
    useGetUserAddresses(id);
  useEffect(() => {
    if (addressesError) {
      toast.error(addressesError.message);
    }
    mutateAddresses();
  }, [addressesError, addresses, mutateAddresses]);

  return (
    <Card>
      <CardHeader
        title="Addresses"
        subheader="List of all users"
        action={
          <Button
            component={RouterLink}
            variant="contained"
            href={paths.dashboard.user.address.create(id)}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add new address
          </Button>
        }
      />
      <CardContent>
        {addressesIsLoading ? (
          <LoadingScreen />
        ) : (
          addresses.map((item) => (
            <AddressItem key={item.id} address={item} variant="outlined" sx={{ p: 2, mb: 2 }} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UserAddressesList;
